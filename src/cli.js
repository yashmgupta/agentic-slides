#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { inspectQuality } from './quality.js';
import { renderHtml } from './render-html.js';
import { renderPptx } from './render-pptx.js';
import { readSpec } from './spec.js';

function parseArgs(argv) {
  if (argv[0] === '--help' || argv[0] === '-h') return { command: null, options: { help: true } };
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith('--')) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    if (key === 'help' || key === 'h') {
      options[key] = true;
      continue;
    }
    const value = rest[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Option --${key} requires a value`);
    options[key] = value;
    index += 1;
  }
  return { command, options };
}

function printHelp() {
  console.log(`Agentic Slides

Usage:
  node src/cli.js validate --input <presentation.json>
  node src/cli.js qa --input <presentation.json>
  node src/cli.js generate --input <presentation.json> [--out <directory>]

Commands:
  validate  Parse and validate the specification.
  qa        Validate and print heuristic quality warnings.
  generate  Write a .pptx and standalone .html presentation.
`);
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'presentation';
}

function showFindings(findings) {
  if (findings.length === 0) {
    console.log('Quality checks: no heuristic warnings.');
    return;
  }
  console.log(`Quality checks: ${findings.length} warning(s). These are review prompts, not proof of visual quality.`);
  findings.forEach((finding) => {
    const location = finding.slide ? `slide ${finding.slide}` : 'theme';
    console.log(`- [${finding.code}] ${location}: ${finding.message}`);
  });
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (!command || options.help) {
    printHelp();
    return;
  }
  if (!['validate', 'qa', 'generate'].includes(command)) {
    throw new Error(`Unknown command "${command}". Run with --help for usage.`);
  }
  if (!options.input) throw new Error(`Command "${command}" requires --input <presentation.json>.`);
  const spec = await readSpec(options.input);
  console.log(`Valid presentation: ${spec.title} (${spec.slides.length} slides).`);
  if (command === 'validate') return;

  const findings = inspectQuality(spec);
  showFindings(findings);
  if (command === 'qa') return;

  const outputDir = path.resolve(options.out ?? 'examples/generated');
  await mkdir(outputDir, { recursive: true });
  const base = slugify(spec.title);
  const pptxPath = path.join(outputDir, `${base}.pptx`);
  const htmlPath = path.join(outputDir, `${base}.html`);
  try {
    await renderPptx(spec, pptxPath);
    await writeFile(htmlPath, renderHtml(spec), 'utf8');
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
  console.log(`Wrote ${pptxPath}`);
  console.log(`Wrote ${htmlPath}`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
