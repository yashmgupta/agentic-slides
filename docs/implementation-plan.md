# Implementation plan

The MVP is intentionally kept small: JSON input, deterministic layouts, PptxGenJS native PowerPoint output, and a standalone HTML renderer. Runtime AI integration is excluded so that a user can reproduce the example outputs for $0 and without a key.

1. Define and validate a versioned JSON schema.
2. Implement shared theme constants and a compact layout set.
3. Render native PowerPoint text/shapes/charts and speaker notes.
4. Render static standalone HTML with keyboard navigation and print CSS.
5. Add structural tests and heuristic QA.
6. Generate the 10-, 8-, and 6-slide sample inputs and export both formats.
7. Test ZIP integrity and HTML output; visually inspect HTML where browser tooling is available. Record limitations rather than claiming unsupported output fidelity.

Future steps: test in LibreOffice/PowerPoint; add image/asset references and safe local paths; implement provenance-aware research claims; introduce optional model adapters only after designing retry, cost, rate limit, and privacy behavior; assess PDF export and visual correction separately.
