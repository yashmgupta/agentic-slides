import pptxgen from 'pptxgenjs';
import { getTheme } from './spec.js';

function plain(color) {
  return color.replace('#', '').toUpperCase();
}

function addText(slide, text, x, y, w, h, style = {}, theme = {}) {
  slide.addText(String(text ?? ''), {
    x, y, w, h,
    margin: 0,
    breakLine: false,
    valign: 'mid',
    fontFace: theme.bodyFont ?? 'Aptos',
    fontSize: 18,
    color: plain(theme.foreground ?? '#172033'),
    fit: 'shrink',
    ...style,
  });
}

function addBase(slide, spec, index, theme) {
  slide.background = { color: plain(theme.background) };
  slide.addShape('rect', {
    x: 0.55, y: 0.46, w: 0.58, h: 0.08,
    line: { color: plain(theme.accent), transparency: 100 },
    fill: { color: plain(theme.accent) },
  });
  if (index > 0 && spec.slides[index].type !== 'title') {
    addText(slide, spec.title, 0.58, 0.24, 8.8, 0.2, {
      fontSize: 8,
      color: plain(theme.muted),
      charSpacing: 0.8,
      bold: true,
    }, theme);
  }
  addText(slide, `${String(index + 1).padStart(2, '0')}  /  ${String(spec.slides.length).padStart(2, '0')}`,
    11.55, 7.08, 1.2, 0.16, { fontSize: 8, color: plain(theme.muted), align: 'right' }, theme);
}

function addHeading(slide, text, theme, y = 0.88, size = 28) {
  addText(slide, text, 0.72, y, 11.9, 0.72, {
    fontFace: theme.headingFont,
    fontSize: size,
    bold: true,
    valign: 'mid',
  }, theme);
}

function addBullets(slide, bullets, theme, x, y, w, h, fontSize = 21) {
  const gap = h / bullets.length;
  bullets.forEach((bullet, index) => {
    slide.addShape('ellipse', {
      x, y: y + index * gap + 0.19, w: 0.11, h: 0.11,
      line: { color: plain(theme.accent), transparency: 100 },
      fill: { color: plain(theme.accent) },
    });
    addText(slide, bullet, x + 0.28, y + index * gap, w - 0.28, gap - 0.06, {
      fontSize, valign: 'mid', breakLine: false,
    }, theme);
  });
}

function renderSlide(pptx, spec, content, index, theme) {
  const slide = pptx.addSlide();
  addBase(slide, spec, index, theme);

  switch (content.type) {
    case 'title':
      addText(slide, content.title, 0.8, 1.62, 11.7, 1.6, {
        fontFace: theme.headingFont, fontSize: 38, bold: true, align: 'center', valign: 'mid',
      }, theme);
      if (content.subtitle || spec.subtitle) {
        addText(slide, content.subtitle ?? spec.subtitle, 1.25, 3.42, 10.8, 0.72, {
          fontSize: 21, color: plain(theme.muted), align: 'center',
        }, theme);
      }
      if (spec.audience) {
        addText(slide, `FOR  ${spec.audience.toUpperCase()}`, 2.2, 5.2, 8.9, 0.32, {
          fontSize: 10, color: plain(theme.accent), bold: true, align: 'center', charSpacing: 1.2,
        }, theme);
      }
      break;
    case 'bullets':
      addHeading(slide, content.title, theme);
      addBullets(slide, content.bullets, theme, 1.0, 2.0, 11.2, 4.2, 20);
      break;
    case 'metric':
      addHeading(slide, content.title, theme);
      slide.addShape('roundRect', {
        x: 1.25, y: 2.08, w: 10.82, h: 3.7, rectRadius: 0.12,
        line: { color: plain(theme.surface), transparency: 100 },
        fill: { color: plain(theme.surface) },
      });
      addText(slide, content.value, 1.55, 2.58, 10.2, 1.55, {
        fontFace: theme.headingFont, fontSize: 52, bold: true, color: plain(theme.accent), align: 'center',
      }, theme);
      addText(slide, content.label, 1.65, 4.42, 10.0, 0.74, {
        fontSize: 22, align: 'center', color: plain(theme.muted),
      }, theme);
      break;
    case 'process': {
      addHeading(slide, content.title, theme);
      const gap = 0.18;
      const cardWidth = (11.8 - gap * (content.steps.length - 1)) / content.steps.length;
      content.steps.forEach((step, stepIndex) => {
        const x = 0.72 + stepIndex * (cardWidth + gap);
        slide.addShape('roundRect', {
          x, y: 2.45, w: cardWidth, h: 2.35,
          line: { color: plain(theme.surface), transparency: 100 },
          fill: { color: plain(theme.surface) },
        });
        addText(slide, String(stepIndex + 1).padStart(2, '0'), x + 0.18, 2.68, cardWidth - 0.36, 0.34, {
          fontSize: 11, bold: true, color: plain(theme.accent),
        }, theme);
        addText(slide, step, x + 0.18, 3.12, cardWidth - 0.36, 1.35, {
          fontSize: 17, bold: true, align: 'center',
        }, theme);
      });
      break;
    }
    case 'chart':
      addHeading(slide, content.title, theme);
      slide.addChart(pptx.ChartType.bar, [{
        name: content.chart.seriesName ?? content.title,
        labels: content.chart.categories,
        values: content.chart.values,
      }], {
        x: 0.78, y: 1.85, w: 11.8, h: 4.65,
        catAxisLabelFontFace: theme.bodyFont,
        catAxisLabelFontSize: 12,
        catAxisLabelColor: plain(theme.foreground),
        valAxisLabelFontFace: theme.bodyFont,
        valAxisLabelFontSize: 10,
        valAxisLabelColor: plain(theme.muted),
        showLegend: false,
        showTitle: false,
        showValue: true,
        showCatName: false,
        showValAxisTitle: false,
        showCatAxisTitle: false,
        chartColors: [plain(theme.accent)],
        showBorder: false,
        showValAxis: true,
        showCatAxis: true,
        valAxisMinVal: 0,
        valGridLine: { color: 'E1E7EF', width: 1 },
        showMarker: false,
        showLine: false,
        chartArea: { fill: { color: plain(theme.background) }, line: { color: plain(theme.background), transparency: 100 } },
        plotArea: { fill: { color: plain(theme.background) }, line: { color: plain(theme.background), transparency: 100 } },
        barDir: 'col',
        catAxisLabelRotate: 0,
      });
      if (content.chart.source) {
        addText(slide, `Source: ${content.chart.source}`, 0.82, 6.58, 10.5, 0.24, {
          fontSize: 9, color: plain(theme.muted),
        }, theme);
      }
      break;
    case 'comparison': {
      addHeading(slide, content.title, theme);
      for (const [side, x] of [['left', 0.78], ['right', 6.86]]) {
        const panel = content[side];
        slide.addShape('roundRect', {
          x, y: 2.02, w: 5.68, h: 4.25,
          line: { color: plain(theme.surface), transparency: 100 },
          fill: { color: plain(theme.surface) },
        });
        addText(slide, panel.heading, x + 0.28, 2.32, 5.12, 0.55, {
          fontFace: theme.headingFont, fontSize: 21, bold: true, color: plain(theme.accent),
        }, theme);
        addBullets(slide, panel.items, theme, x + 0.32, 3.12, 5.0, 2.72, 15);
      }
      break;
    }
    case 'quote':
      addHeading(slide, content.title, theme);
      addText(slide, `“${content.quote}”`, 1.18, 2.05, 10.95, 2.75, {
        fontFace: theme.headingFont, fontSize: 28, bold: true, align: 'center', valign: 'mid',
      }, theme);
      if (content.attribution) {
        addText(slide, content.attribution, 2, 5.18, 9.3, 0.45, {
          fontSize: 14, color: plain(theme.muted), align: 'center',
        }, theme);
      }
      break;
    case 'closing':
      addText(slide, content.title, 0.85, 2.12, 11.65, 1.1, {
        fontFace: theme.headingFont, fontSize: 34, bold: true, align: 'center',
      }, theme);
      addText(slide, content.message ?? 'Thank you', 1.35, 3.58, 10.6, 0.9, {
        fontSize: 21, color: plain(theme.muted), align: 'center',
      }, theme);
      break;
  }

  if (content.notes) slide.addNotes(content.notes);
  return slide;
}

export async function renderPptx(spec, outputPath) {
  const theme = getTheme(spec);
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = spec.author ?? 'Agentic Slides';
  pptx.subject = spec.objective ?? 'Generated from a structured presentation specification';
  pptx.title = spec.title;
  pptx.company = 'Agentic Slides';
  pptx.lang = 'en-US';
  pptx.theme = {
    headFontFace: theme.headingFont,
    bodyFontFace: theme.bodyFont,
    lang: 'en-US',
  };
  spec.slides.forEach((slide, index) => renderSlide(pptx, spec, slide, index, theme));
  await pptx.writeFile({ fileName: outputPath });
}
