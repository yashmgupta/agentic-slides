# Feature specification — MVP

## User stories

1. As a beginner, I can copy a JSON example, alter its content, and create a deck without configuring a model or API.
2. As a model user, I can ask an assistant to fill a documented schema and render its response locally.
3. As a presenter, I can open a navigable HTML deck or edit slide text/shapes/chart data in PowerPoint.
4. As a reviewer, I can run validation and see actionable errors and heuristic warnings before delivery.

## Version 1 input

Top-level fields: `schemaVersion`, `title`, optional `subtitle`, `audience`, `objective`, `theme`, and ordered `slides`.

Slide types: `title`, `bullets`, `metric`, `process`, `chart`, `comparison`, `quote`, `closing`.

Every slide may include `notes` and optional `sources` text. Chart data has named categories and finite values; mismatched arrays are rejected. Colors are hex. The schema deliberately avoids model-specific fields and absolute placement.

## Functional requirements

- Validate specification and charts before export.
- Produce PPTX and HTML from the same input.
- Embed per-slide speaker notes in PPTX and show notes in HTML presenter mode / document structure.
- Make quality warnings visible and distinguish warnings from fatal errors.
- Keep all outputs local and deterministic for a fixed input and dependency version.
- Use nonzero CLI exit status and explain validation/export failures.

## Non-goals

No mandatory AI API, web app/server, authentication, team database, live web research, citation verification, image generation, advanced brand asset management, PDF export, animation, or automatic visual correction in v1.

## Acceptance and compatibility

See [benchmark-results.md](../research/benchmark-results.md) for executable sample counts and validation outcomes. HTML is intended for modern browsers. PPTX is a standard editable Office package; actual appearance depends on installed fonts and Office-compatible renderers. Skill instructions are plain Markdown and can be adapted, but platform-specific discovery/install conventions are not guaranteed portable.
