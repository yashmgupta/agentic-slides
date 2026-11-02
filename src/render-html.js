import { getTheme } from './spec.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function notesMarkup(slide) {
  if (!slide.notes) return '';
  return `<details class="notes"><summary>Speaker notes</summary><p>${escapeHtml(slide.notes)}</p></details>`;
}

function bulletsMarkup(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function chartMarkup(slide, accent, foreground, muted) {
  const { categories, values } = slide.chart;
  const maximum = Math.max(...values, 1);
  const rowHeight = 62;
  const chartHeight = Math.max(240, rowHeight * categories.length + 36);
  const bars = categories.map((category, index) => {
    const y = index * rowHeight + 10;
    const barWidth = Math.max(1, (values[index] / maximum) * 55);
    return `<text x="0" y="${y + 22}" fill="${foreground}" font-size="16">${escapeHtml(category)}</text>
      <rect x="260" y="${y}" width="${barWidth}%" height="34" rx="8" fill="${accent}"></rect>
      <text x="${Math.min(barWidth + 28, 94)}%" y="${y + 23}" fill="${foreground}" font-size="15">${escapeHtml(values[index])}</text>`;
  }).join('\n');
  const source = slide.chart.source ? `<p class="source">Source: ${escapeHtml(slide.chart.source)}</p>` : '';
  return `<svg class="chart-graphic" viewBox="0 0 1000 ${chartHeight}" role="img" aria-label="${escapeHtml(slide.title)} bar chart">
    <g>${bars}</g>
  </svg>${source}`;
}

function bodyMarkup(slide, theme) {
  switch (slide.type) {
    case 'title':
      return `<div class="hero"><p class="eyebrow">${escapeHtml(slide.audience ?? '')}</p>
        <h1>${escapeHtml(slide.title)}</h1>
        <p class="subtitle">${escapeHtml(slide.subtitle ?? '')}</p></div>`;
    case 'bullets':
      return bulletsMarkup(slide.bullets);
    case 'metric':
      return `<div class="metric"><strong>${escapeHtml(slide.value)}</strong><p>${escapeHtml(slide.label)}</p></div>`;
    case 'process':
      return `<ol class="steps">${slide.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>`;
    case 'chart':
      return chartMarkup(slide, theme.accent, theme.foreground, theme.muted);
    case 'comparison':
      return `<div class="comparison">
        <section><h3>${escapeHtml(slide.left.heading)}</h3>${bulletsMarkup(slide.left.items)}</section>
        <section><h3>${escapeHtml(slide.right.heading)}</h3>${bulletsMarkup(slide.right.items)}</section>
      </div>`;
    case 'quote':
      return `<blockquote>“${escapeHtml(slide.quote)}”</blockquote>${slide.attribution ? `<p class="attribution">${escapeHtml(slide.attribution)}</p>` : ''}`;
    case 'closing':
      return `<div class="hero"><h1>${escapeHtml(slide.title)}</h1><p class="subtitle">${escapeHtml(slide.message ?? 'Thank you')}</p></div>`;
    default:
      throw new Error(`Unsupported slide type during HTML rendering: ${slide.type}`);
  }
}

export function renderHtml(spec) {
  const theme = getTheme(spec);
  const slides = spec.slides.map((slide, index) => {
    const title = slide.type === 'title' ? '' : `<h2>${escapeHtml(slide.title)}</h2>`;
    return `<article class="slide slide--${slide.type}" aria-label="Slide ${index + 1} of ${spec.slides.length}" ${index === 0 ? '' : 'hidden'}>
      <div class="topline"></div>
      ${title}
      <div class="content">${bodyMarkup({ ...slide, audience: spec.audience }, theme)}</div>
      ${notesMarkup(slide)}
      <footer><span>${escapeHtml(spec.title)}</span><span>${String(index + 1).padStart(2, '0')} / ${String(spec.slides.length).padStart(2, '0')}</span></footer>
    </article>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(spec.objective ?? spec.title)}">
  <title>${escapeHtml(spec.title)}</title>
  <style>
    :root {
      --background: ${theme.background};
      --foreground: ${theme.foreground};
      --accent: ${theme.accent};
      --muted: ${theme.muted};
      --surface: ${theme.surface};
      --heading-font: "${theme.headingFont}", "Aptos Display", sans-serif;
      --body-font: "${theme.bodyFont}", "Aptos", sans-serif;
    }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 2rem 1rem 5.5rem; background: #e9edf4; color: var(--foreground); font-family: var(--body-font); }
    .slide { position: relative; width: min(94vw, 1280px, calc((100vh - 8rem) * 1.7778)); max-height: calc(100vh - 8rem); aspect-ratio: 16 / 9; overflow: hidden; padding: 6.5% 7%; background: var(--background); box-shadow: 0 24px 70px #17203324; }
    .slide[hidden] { display: none; }
    .topline { position: absolute; top: 5.7%; left: 7%; width: 4.5%; height: 5px; background: var(--accent); border-radius: 6px; }
    h1, h2, h3 { font-family: var(--heading-font); }
    h1 { margin: 0; font-size: clamp(2.2rem, 5vw, 4.5rem); line-height: 1.08; letter-spacing: -.035em; }
    h2 { margin: 1.5% 0 3%; font-size: clamp(1.7rem, 3.2vw, 2.8rem); line-height: 1.15; }
    h3 { margin-top: 0; font-size: clamp(1.1rem, 2vw, 1.55rem); color: var(--accent); }
    .content { height: 74%; display: flex; flex-direction: column; justify-content: center; font-size: clamp(1rem, 2vw, 1.65rem); }
    .hero { text-align: center; }
    .hero h1 { max-width: 13ch; margin: 0 auto; }
    .eyebrow { color: var(--accent); text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; font-weight: 700; }
    .subtitle, .attribution { color: var(--muted); font-size: clamp(1rem, 1.7vw, 1.4rem); text-align: center; }
    ul { margin: 0; padding-left: 1.35em; }
    li { padding: .32em 0; line-height: 1.35; }
    li::marker { color: var(--accent); }
    .metric { padding: 3rem 1rem; text-align: center; border-radius: 1.4rem; background: var(--surface); }
    .metric strong { display: block; color: var(--accent); font: 700 clamp(3rem, 8vw, 6rem)/1 var(--heading-font); }
    .metric p { color: var(--muted); }
    .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: .8rem; margin: 0; padding: 0; list-style: none; counter-reset: step; }
    .steps li { min-height: 9rem; display: flex; align-items: center; justify-content: center; padding: 1rem; border-radius: 1rem; background: var(--surface); text-align: center; font-weight: 650; counter-increment: step; }
    .steps li::before { content: counter(step, decimal-leading-zero); display: block; align-self: flex-start; margin-right: .55rem; color: var(--accent); font-size: .75rem; }
    .chart-graphic { width: 100%; max-height: 82%; overflow: visible; }
    .chart-graphic text { font-family: var(--body-font); }
    .source { color: var(--muted); font-size: .75rem; }
    .comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .comparison section { padding: 1.4rem; border-radius: 1rem; background: var(--surface); }
    .comparison ul { font-size: .88em; }
    blockquote { max-width: 22ch; margin: auto; text-align: center; font: 700 clamp(1.6rem, 3.4vw, 3rem)/1.2 var(--heading-font); }
    .attribution { margin-top: 1.5rem; }
    .notes { position: absolute; bottom: 8%; left: 7%; max-width: 75%; font-size: .72rem; color: var(--muted); }
    .notes p { max-height: 4rem; overflow: auto; }
    footer { position: absolute; bottom: 5%; right: 7%; left: 7%; display: flex; justify-content: space-between; gap: 1rem; color: var(--muted); font-size: .65rem; }
    .controls { position: fixed; bottom: 1rem; left: 50%; display: flex; align-items: center; gap: .8rem; transform: translateX(-50%); padding: .45rem .7rem; border-radius: 999px; background: #172033; color: white; }
    .controls button { border: 0; border-radius: 999px; padding: .55rem .85rem; background: #fff; color: #172033; font: inherit; cursor: pointer; }
    .controls button:focus-visible { outline: 3px solid #87a7ff; outline-offset: 2px; }
    #counter { min-width: 3rem; text-align: center; font-size: .85rem; }
    @media (max-width: 680px) {
      body { place-items: start center; padding: 1rem .5rem 5.5rem; }
      .slide { width: 98vw; min-height: 70vh; max-height: none; aspect-ratio: auto; overflow: visible; padding: 2.5rem 1.25rem 1.5rem; }
      .content { height: auto; min-height: 55vh; justify-content: flex-start; font-size: 1rem; }
      .hero h1 { font-size: clamp(1.8rem, 8vw, 3rem); }
      h2 { font-size: clamp(1.3rem, 6vw, 1.9rem); }
      .comparison { grid-template-columns: 1fr; gap: .6rem; }
      .comparison section { padding: .8rem; }
      .comparison ul { padding-left: 1rem; }
      .notes { position: static; max-width: 100%; margin-top: 1rem; font-size: .8rem; }
      footer { position: static; margin-top: 1.25rem; font-size: .7rem; }
    }
    @media print {
      body { display: block; padding: 0; background: white; }
      .slide, .slide[hidden] { display: block !important; width: 100vw; height: 56.25vw; max-height: 100vh; margin: 0; box-shadow: none; break-after: page; }
      .controls { display: none; }
    }
  </style>
</head>
<body>
  <main id="deck" aria-live="polite">
    ${slides}
  </main>
  <nav class="controls" aria-label="Presentation controls">
    <button id="previous" type="button" aria-label="Previous slide">←</button>
    <span id="counter" aria-live="polite">1 / ${spec.slides.length}</span>
    <button id="next" type="button" aria-label="Next slide">→</button>
  </nav>
  <script>
    (() => {
      const slides = [...document.querySelectorAll('.slide')];
      const counter = document.getElementById('counter');
      let current = 0;
      function show(index) {
        current = Math.max(0, Math.min(slides.length - 1, index));
        slides.forEach((slide, position) => {
          slide.hidden = position !== current;
        });
        counter.textContent = (current + 1) + ' / ' + slides.length;
      }
      document.getElementById('previous').addEventListener('click', () => show(current - 1));
      document.getElementById('next').addEventListener('click', () => show(current + 1));
      document.addEventListener('keydown', (event) => {
        if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); show(current + 1); }
        if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); show(current - 1); }
        if (event.key === 'Home') show(0);
        if (event.key === 'End') show(slides.length - 1);
      });
    })();
  </script>
</body>
</html>`;
}
