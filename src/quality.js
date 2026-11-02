import { getTheme } from './spec.js';

function luminance(hex) {
  const values = hex.replace('#', '').match(/.{2}/g).map((part) => parseInt(part, 16) / 255);
  const linear = values.map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function contrastRatio(first, second) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

function slideText(slide) {
  const fields = [slide.title, slide.subtitle, slide.value, slide.label, slide.quote, slide.attribution, slide.message];
  if (slide.bullets) fields.push(...slide.bullets);
  if (slide.steps) fields.push(...slide.steps);
  if (slide.left) fields.push(slide.left.heading, ...slide.left.items);
  if (slide.right) fields.push(slide.right.heading, ...slide.right.items);
  if (slide.chart) fields.push(...slide.chart.categories, slide.chart.seriesName);
  return fields.filter((value) => typeof value === 'string').join(' ');
}

function longTextFields(slide) {
  const checks = [];
  const check = (field, value, limit) => {
    if (typeof value === 'string' && value.length > limit) checks.push(field);
  };
  check('title', slide.title, 72);
  if (slide.type === 'title') check('subtitle', slide.subtitle, 110);
  if (slide.type === 'bullets') slide.bullets.forEach((value, index) => check(`bullet ${index + 1}`, value, 100));
  if (slide.type === 'metric') {
    check('metric value', slide.value, 24);
    check('metric label', slide.label, 110);
  }
  if (slide.type === 'process') slide.steps.forEach((value, index) => check(`step ${index + 1}`, value, 60));
  if (slide.type === 'comparison') {
    for (const side of ['left', 'right']) {
      check(`${side} heading`, slide[side].heading, 42);
      slide[side].items.forEach((value, index) => check(`${side} item ${index + 1}`, value, 70));
    }
  }
  if (slide.type === 'quote') check('quote', slide.quote, 230);
  if (slide.type === 'chart') slide.chart.categories.forEach((value, index) => check(`chart category ${index + 1}`, value, 28));
  return checks;
}

export function inspectQuality(spec) {
  const theme = getTheme(spec);
  const findings = [];
  const add = (severity, code, message, slide) => {
    findings.push({ severity, code, message, ...(slide === undefined ? {} : { slide: slide + 1 }) });
  };

  const contrast = contrastRatio(theme.foreground, theme.background);
  if (contrast < 4.5) {
    add('warning', 'low-contrast', `Theme foreground/background contrast is ${contrast.toFixed(2)}:1; aim for at least 4.5:1 for normal text.`);
  }
  const accentContrast = contrastRatio(theme.accent, theme.background);
  if (accentContrast < 3) {
    add('warning', 'accent-contrast', `Theme accent/background contrast is ${accentContrast.toFixed(2)}:1; verify accent text and small marks.`);
  }

  const titles = new Set();
  spec.slides.forEach((slide, index) => {
    const text = slideText(slide);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (slide.title.length > 72) add('warning', 'long-title', 'Title exceeds 72 characters; consider shortening it.', index);
    if (words > 68) add('warning', 'dense-slide', `Slide contains approximately ${words} words; check density and move detail to notes.`, index);
    const longFields = longTextFields(slide);
    if (longFields.length) {
      add('warning', 'text-fit-estimate', `Long ${longFields.join(', ')} may shrink or overflow in a fixed layout; inspect the rendered slide.`, index);
    }
    if (slide.type === 'bullets' && slide.bullets.length > 4) {
      add('warning', 'many-bullets', 'More than four bullets may be difficult to scan.', index);
    }
    if (slide.type === 'process' && slide.steps.length > 4) {
      add('warning', 'many-process-steps', 'More than four process steps may be hard to fit legibly.', index);
    }
    const normalized = slide.title.trim().toLowerCase();
    if (titles.has(normalized)) add('warning', 'duplicate-title', 'Another slide uses the same title.', index);
    titles.add(normalized);
  });

  return findings;
}
