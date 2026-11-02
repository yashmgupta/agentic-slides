import { readFile } from 'node:fs/promises';

export const SLIDE_TYPES = new Set([
  'title',
  'bullets',
  'metric',
  'process',
  'chart',
  'comparison',
  'quote',
  'closing',
]);

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function fail(path, message) {
  throw new Error(`${path}: ${message}`);
}

function requireText(object, key, path) {
  if (!isNonEmptyString(object[key])) fail(`${path}.${key}`, 'must be a non-empty string');
}

function requireStringArray(value, path, { min = 1, max = 8 } = {}) {
  if (!Array.isArray(value) || value.length < min || value.length > max) {
    fail(path, `must be an array with ${min} to ${max} items`);
  }
  value.forEach((item, index) => {
    if (!isNonEmptyString(item)) fail(`${path}[${index}]`, 'must be a non-empty string');
  });
}

function validateSlide(slide, index) {
  const path = `slides[${index}]`;
  if (!slide || typeof slide !== 'object' || Array.isArray(slide)) fail(path, 'must be an object');
  if (!SLIDE_TYPES.has(slide.type)) fail(`${path}.type`, `must be one of ${[...SLIDE_TYPES].join(', ')}`);
  requireText(slide, 'title', path);
  if (slide.notes !== undefined && typeof slide.notes !== 'string') {
    fail(`${path}.notes`, 'must be a string');
  }
  if (slide.sources !== undefined) requireStringArray(slide.sources, `${path}.sources`, { min: 0, max: 12 });

  switch (slide.type) {
    case 'title':
      if (index !== 0) fail(`${path}.type`, 'title slides are only supported at position 1');
      break;
    case 'bullets':
      requireStringArray(slide.bullets, `${path}.bullets`, { max: 5 });
      break;
    case 'metric':
      requireText(slide, 'value', path);
      requireText(slide, 'label', path);
      break;
    case 'process':
      requireStringArray(slide.steps, `${path}.steps`, { max: 5 });
      break;
    case 'chart': {
      const chart = slide.chart;
      if (!chart || typeof chart !== 'object') fail(`${path}.chart`, 'must be an object');
      if (chart.type !== 'bar') fail(`${path}.chart.type`, 'only bar charts are supported');
      requireStringArray(chart.categories, `${path}.chart.categories`, { max: 8 });
      if (!Array.isArray(chart.values) || chart.values.length !== chart.categories.length) {
        fail(`${path}.chart.values`, 'must contain one numeric value per category');
      }
      chart.values.forEach((value, valueIndex) => {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
          fail(`${path}.chart.values[${valueIndex}]`, 'must be a finite non-negative number');
        }
      });
      if (chart.seriesName !== undefined && !isNonEmptyString(chart.seriesName)) {
        fail(`${path}.chart.seriesName`, 'must be a non-empty string when provided');
      }
      if (chart.source !== undefined && !isNonEmptyString(chart.source)) {
        fail(`${path}.chart.source`, 'must be a non-empty string when provided');
      }
      break;
    }
    case 'comparison':
      for (const side of ['left', 'right']) {
        const value = slide[side];
        if (!value || typeof value !== 'object') fail(`${path}.${side}`, 'must be an object');
        requireText(value, 'heading', `${path}.${side}`);
        requireStringArray(value.items, `${path}.${side}.items`, { max: 4 });
      }
      break;
    case 'quote':
      requireText(slide, 'quote', path);
      if (slide.attribution !== undefined && !isNonEmptyString(slide.attribution)) {
        fail(`${path}.attribution`, 'must be a non-empty string when provided');
      }
      break;
    case 'closing':
      if (slide.message !== undefined && !isNonEmptyString(slide.message)) {
        fail(`${path}.message`, 'must be a non-empty string when provided');
      }
      break;
  }
}

export function validateSpec(spec) {
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) fail('presentation', 'must be an object');
  if (spec.schemaVersion !== 1) fail('schemaVersion', 'must be 1');
  requireText(spec, 'title', 'presentation');
  if (spec.subtitle !== undefined && typeof spec.subtitle !== 'string') fail('subtitle', 'must be a string');
  if (spec.audience !== undefined && typeof spec.audience !== 'string') fail('audience', 'must be a string');
  if (spec.objective !== undefined && typeof spec.objective !== 'string') fail('objective', 'must be a string');
  if (spec.theme !== undefined) {
    if (!spec.theme || typeof spec.theme !== 'object' || Array.isArray(spec.theme)) fail('theme', 'must be an object');
    for (const key of ['background', 'foreground', 'accent', 'muted', 'surface']) {
      if (spec.theme[key] !== undefined && !HEX_COLOR.test(spec.theme[key])) {
        fail(`theme.${key}`, 'must be a six-digit hex color such as #123ABC');
      }
    }
    for (const key of ['headingFont', 'bodyFont']) {
      if (spec.theme[key] !== undefined &&
          (!isNonEmptyString(spec.theme[key]) || spec.theme[key].length > 64 || !/^[A-Za-z0-9 ,_-]+$/.test(spec.theme[key]))) {
        fail(`theme.${key}`, 'must be a short font family name using letters, numbers, spaces, commas, hyphens, or underscores');
      }
    }
  }
  if (!Array.isArray(spec.slides) || spec.slides.length < 2 || spec.slides.length > 60) {
    fail('slides', 'must contain between 2 and 60 slides');
  }
  if (spec.slides[0]?.type !== 'title') fail('slides[0].type', 'the first slide must be a title slide');
  spec.slides.forEach(validateSlide);
  if (spec.slides.at(-1).type !== 'closing') {
    fail('slides[last].type', 'the final slide must be a closing slide');
  }
  return spec;
}

export async function readSpec(filePath) {
  let source;
  try {
    source = await readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Could not read input file "${filePath}": ${error.message}`);
  }
  let spec;
  try {
    spec = JSON.parse(source);
  } catch (error) {
    throw new Error(`Invalid JSON in "${filePath}": ${error.message}`);
  }
  return validateSpec(spec);
}

export function getTheme(spec) {
  return {
    background: '#F7F8FA',
    foreground: '#172033',
    accent: '#3657D6',
    muted: '#64748B',
    surface: '#FFFFFF',
    headingFont: 'Aptos Display',
    bodyFont: 'Aptos',
    ...spec.theme,
  };
}
