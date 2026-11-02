import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import JSZip from 'jszip';
import { inspectQuality, contrastRatio } from '../src/quality.js';
import { renderHtml } from '../src/render-html.js';
import { renderPptx } from '../src/render-pptx.js';
import { validateSpec } from '../src/spec.js';

const root = path.resolve(import.meta.dirname, '..');

async function loadExample(name) {
  const contents = await readFile(path.join(root, 'examples', name), 'utf8');
  return JSON.parse(contents);
}

test('all sample decks satisfy the version 1 specification and required slide counts', async () => {
  const cases = [
    ['business-pitch.json', 10],
    ['educational-ai.json', 8],
    ['data-report.json', 6],
  ];
  for (const [file, count] of cases) {
    const spec = validateSpec(await loadExample(file));
    assert.equal(spec.slides.length, count);
    assert.equal(spec.slides[0].type, 'title');
    assert.equal(spec.slides.at(-1).type, 'closing');
  }
});

test('invalid chart data and unsupported types are rejected clearly', async () => {
  const original = await loadExample('data-report.json');
  const mismatch = structuredClone(original);
  mismatch.slides[1].chart.values.pop();
  assert.throws(() => validateSpec(mismatch), /one numeric value per category/);

  const badType = structuredClone(original);
  badType.slides[1].type = 'magic';
  assert.throws(() => validateSpec(badType), /must be one of/);

  const unsafeFont = structuredClone(original);
  unsafeFont.theme.headingFont = 'Aptos; }</style><script>';
  assert.throws(() => validateSpec(unsafeFont), /font family name/);
});

test('quality checks identify theme contrast and dense content without crashing', async () => {
  const spec = await loadExample('business-pitch.json');
  assert.ok(contrastRatio('#000000', '#FFFFFF') > 20);
  assert.ok(Array.isArray(inspectQuality(spec)));
  const lowContrast = structuredClone(spec);
  lowContrast.theme.foreground = '#FFFFFF';
  lowContrast.theme.background = '#FFFFFF';
  assert.ok(inspectQuality(lowContrast).some((item) => item.code === 'low-contrast'));
});

test('HTML output is self-contained, navigable, escaped, and has one article per slide', async () => {
  const spec = await loadExample('educational-ai.json');
  spec.slides[1].bullets[0] = '<script>alert("x")</script>';
  const html = renderHtml(spec);
  assert.equal((html.match(/<article class="slide/g) ?? []).length, spec.slides.length);
  assert.match(html, /ArrowRight/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>alert/);
  assert.match(html, /@media print/);
});

test('portable skill has the expected frontmatter and documented local commands', async () => {
  const skill = await readFile(path.join(root, 'skills/presentation-generator/SKILL.md'), 'utf8');
  assert.match(skill, /^---\nname: presentation-generator\ndescription: .+\n---/);
  assert.match(skill, /node src\/cli\.js validate/);
  assert.match(skill, /node src\/cli\.js generate/);
});

test('CLI exposes help without requiring a subcommand', () => {
  const result = spawnSync(process.execPath, ['src/cli.js', '--help'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /generate/);
});

test('all sample decks export readable PPTX packages and standalone HTML', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'slideforge-test-'));
  try {
    for (const [file, count, expectedCharts] of [
      ['business-pitch.json', 10, [['60', '32', '8']]],
      ['educational-ai.json', 8, []],
      ['data-report.json', 6, [['42', '48', '47', '61', '68'], ['18', '12', '9', '6']]],
    ]) {
      const spec = await loadExample(file);
      const base = path.basename(file, '.json');
      const pptxPath = path.join(directory, `${base}.pptx`);
      const htmlPath = path.join(directory, `${base}.html`);
      await renderPptx(spec, pptxPath);
      await writeFile(htmlPath, renderHtml(spec));
      const archive = await JSZip.loadAsync(await readFile(pptxPath), { checkCRC32: true });
      const readEntry = async (entryPath) => {
        const entry = archive.file(entryPath);
        assert.ok(entry, `missing PPTX entry ${entryPath}`);
        return entry.async('string');
      };
      const files = Object.keys(archive.files);
      const presentation = await readEntry('ppt/presentation.xml');
      const firstSlide = await readEntry('ppt/slides/slide1.xml');
      const firstNotes = await readEntry('ppt/notesSlides/notesSlide1.xml');
      const html = await readFile(htmlPath, 'utf8');
      assert.equal((presentation.match(/<p:sldId\b/g) ?? []).length, count);
      assert.match(firstSlide, /<p:sp>/);
      assert.ok(files.includes('ppt/notesSlides/notesSlide1.xml'));
      assert.match(firstNotes, /Opening|Invite learners|All values/);
      const chartPaths = files.filter((entryPath) => /^ppt\/charts\/chart\d+\.xml$/.test(entryPath));
      assert.equal(chartPaths.length, expectedCharts.length, `${file} chart count`);
      assert.equal((html.match(/<article class="slide/g) ?? []).length, count);
      for (const [chartIndex, chartPath] of chartPaths.entries()) {
        const chart = await readEntry(chartPath);
        for (const value of expectedCharts[chartIndex]) assert.match(chart, new RegExp(`<c:v>${value}</c:v>`));
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
