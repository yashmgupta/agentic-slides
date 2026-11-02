# Architecture

## Design principles

- Content is a versioned JSON document; presentation logic does not require an LLM.
- A model or human can create/edit the document, but deterministic code owns slide geometry and export.
- HTML and PPTX are two renderers of the same specification. They share content and theme but are not pixel-identical.
- PPTX content uses native PowerPoint text, shapes, and charts where implemented; HTML is responsive and self-contained.
- Validation separates hard structural errors from heuristic quality warnings. Nothing in local validation proves factual correctness or subjective design quality.

## Data flow

```text
Brief, outline, or authored JSON
             |
             v
Versioned presentation.json
             |
       parse + validate
             |
     content/quality checks
             |
      +------+------+
      |             |
      v             v
 editable PPTX   self-contained HTML
```

## Components

- `src/spec.js`: validates schema version, theme, slide types, required fields, and chart data.
- `src/quality.js`: emits severity-tagged, slide-indexed checks for text density, contrast, and supported geometry. These checks are deliberately conservative heuristics.
- `src/render-pptx.js`: uses PptxGenJS to generate 16:9 slides. It applies shared theme tokens, deterministic layouts, native bar charts, and speaker notes.
- `src/render-html.js`: creates a single HTML file with inline CSS/SVG chart marks, navigation controls, keyboard handling, accessible labels, and print styles.
- `src/cli.js`: validates or exports user-authored JSON; errors return nonzero status and diagnostics.

## Specification and rendering boundary

The model-facing files in `prompts/` ask a model to return the schema, not coordinate values or code. A user can also write JSON manually and run the CLI without any model. Version 1 intentionally supports a small set of explicit slide types; unsupported layout requests should be represented as content or addressed in a later schema version rather than guessed during rendering.

## Quality and trust boundaries

Hard checks: parseability, supported schema/version/type, non-empty required content, valid colors, finite numeric chart data, matching chart labels/value lengths, and required filenames.

Heuristics: approximate word/character density, repeated slide structure, theme contrast, and title/bullet lengths. They flag review targets; they are not rendered text measurement.

Human checks: factual validity, evidence quality, story flow, chart appropriateness, clipping in real PowerPoint/browser renderers, fonts, and aesthetic judgment.

No source document retrieval, internet research, model call, credentials, telemetry, database, or external image download is performed by the MVP.

## Formats and editability

- PPTX is generated from native text, shapes, and charts via PptxGenJS. PowerPoint and compatible office applications may differ in fonts and rendering.
- HTML is a single local file. It does not import network resources.
- PDF is omitted. A dependable PDF workflow requires a tested browser or office renderer; LibreOffice was not available during the initial environment inspection.
