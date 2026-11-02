# Usage

## Quick start

```bash
npm install
npm run validate -- --input examples/business-pitch.json
npm run qa -- --input examples/business-pitch.json
npm run generate -- --input examples/business-pitch.json --out out
```

The CLI has three commands:

- `validate` checks JSON structure and supported fields.
- `qa` prints heuristic warnings for theme contrast, long fields, and dense/duplicate slides.
- `generate` validates, reports QA warnings, and writes `<title>.pptx` and `<title>.html`.

Errors go to stderr and return a nonzero exit code. QA warnings do not prevent export; review them rather than treating them as proof that a deck is safe to deliver.

## Create your own presentation

Copy one of the files in `examples/`, edit its JSON, and keep `schemaVersion` set to `1`. The first slide must have type `title`, the last must have type `closing`, and there must be 2–60 slides. Supported types are:

| Type | Required content |
|---|---|
| `title` | `title`; optional `subtitle` |
| `bullets` | `title`, 1–5 `bullets` |
| `metric` | `title`, `value`, `label` |
| `process` | `title`, 1–5 `steps` |
| `chart` | `title`, `chart` with `type: "bar"`, categories and matching non-negative numeric values |
| `comparison` | `title`, `left` and `right`, each with `heading` and 1–4 `items` |
| `quote` | `title`, `quote`; optional `attribution` |
| `closing` | `title`; optional `message` |

Any slide may have a `notes` string. Charts may include a `source` label. Sources are displayed as supplied; the toolkit does not verify them.

## Optional model-assisted drafting

Use the copyable prompts in `prompts/` with an LLM of your choice. Ask for JSON only, save the response, and run the local validator. The toolkit itself makes no model calls. If the model invents unsupported values or citations, remove or verify them before publishing.

## Outputs and editing

- PPTX uses native text/shapes and a native PowerPoint bar chart; slide notes are embedded when provided.
- HTML is a single file with keyboard arrows/Page Up/Page Down/Home/End, a slide counter, notes disclosure, and print stylesheet. Open it directly in a modern browser.
- No PDF export, image generation, internet research, or automatic factual verification is included.

## QA interpretation

Warnings estimate potential text shrink/overflow from field length and content density, and check theme contrast. The checks do not measure actual rendered glyph dimensions or assess story quality. Review every exported deck in a browser and an Office-compatible application, especially long titles, process labels, chart labels, fonts, and source claims.
