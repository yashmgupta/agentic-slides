# Opportunity analysis and MVP choice

## What the evidence supports

The reviewed projects demonstrate several useful implementation patterns—schema-constrained content, program-owned layout, preview/render review, native PowerPoint elements, source citations, and agent-facing instructions. They do **not** establish a common benchmark proving one system produces better presentations. The opportunity is to combine a small, testable local toolchain with clear format boundaries, not to claim superiority.

## Prioritized feature assessment

Complexity is relative to this repository's proposed first release (low / medium / high). Reliability refers to whether the feature can be deterministically verified, not whether the generated content is true.

| Priority | Feature | User value | Complexity | Differentiation | Reliability | MVP decision |
|---:|---|---|---|---|---|---|
| 1 | Structured JSON spec; no-model path | High | Low | High accessibility | High | Build first |
| 2 | Shared theme and deterministic reusable layouts | High | Medium | Medium | High for structure | Build |
| 3 | Editable PPTX with text, shapes, native charts, notes | High | Medium | High | High for object structure; fonts vary by viewer | Build |
| 4 | Self-contained HTML deck and keyboard navigation | High | Low/medium | Medium | High for file generation; browser rendering varies | Build |
| 5 | Basic content-density, required-field, chart, contrast, and overflow heuristics | High | Medium | High as honest, actionable QA | High for detectable properties; heuristic for text fit | Build and label limitations |
| 6 | Speaker notes | Medium/high | Low/medium | Medium | High for inclusion; presentation app behavior varies | Build |
| 7 | Visual screenshot inspection | High | Medium | High | Human judgment, not fully automatable | Documented manual review; use browser screenshot if available |
| 8 | Multi-provider LLM orchestration | High | High | Medium | Provider/model dependent | Defer; prompt templates remain model-independent |
| 9 | Citation provenance and fact-checking | High for research decks | High | High | Partial only without source-level claim tests | Roadmap; require supplied sources and evidence schema |
| 10 | PDF export | Medium | Medium/high | Low | Depends on office/browser renderer | Defer: LibreOffice not found in current environment |
| 11 | Automatic visual repair and iterative critique | Medium/high | High | Medium | Non-deterministic; needs visual benchmark | Roadmap |
| 12 | Brand upload, asset library, team collaboration | Medium | High | Low/medium | Mixed | Defer to avoid infrastructure |

## Gaps worth exploring, not claims of novelty

- **A small deterministic core plus portable prompts** is less demanding than a full SaaS agent, and makes it easier to isolate whether failures came from content or rendering.
- **Actionable structural QA** can report exactly which slide has too many bullets, poor contrast, invalid chart values, or a box outside the canvas. Many product descriptions emphasize visual quality but source-level reproducibility and exact test output remain uneven in the reviewed set.
- **Honest editability metadata**—native text, native chart, raster/background image—helps users know what can be changed after export. The dual-layer and HTML-first projects illustrate why “PPTX export” alone is not enough.
- **A model-neutral specification** lets a reader use ChatGPT, Claude, Gemini, or another assistant to draft valid JSON, with no paid API or platform-specific skill required by the generator.
- **Evidence-aware research decks** are valuable but should be a later feature: citations need claim/source matching and references must survive content shortening and layout changes.

These are implementation opportunities arising from the reviewed designs; no claim is made that no other project already implements them.

## MVP acceptance criteria

1. A supplied valid JSON file produces a PPTX with editable text/shapes, native bar charts, speaker notes, and one 16:9 theme.
2. The same file produces a self-contained HTML deck that supports keyboard navigation and print-friendly styling.
3. No network connection, model key, database, Docker, or paid dependency is needed at runtime.
4. Validation rejects malformed/empty charts and unknown slide types; QA identifies measurable density, contrast, and geometry issues without silently claiming subjective quality.
5. Three sample decks (10-slide business pitch, 8-slide educational overview, 6-slide chart report) pass the test suite. Artifact package integrity and HTML structures are checked; visual layout still requires browser/PowerPoint inspection.
6. User documentation states that factual accuracy, font availability, and visual design judgment require human review.

## Comparison plan and limits

For an actual output comparison, run the **same brief and supplied facts** through this project and at least two comparable systems only after:

- confirming source projects' licenses and current dependencies,
- installing them in an isolated environment,
- recording model/provider/version, prompt, parameters, date, and costs,
- using the same slide count and source data,
- scoring structure, editability, chart data fidelity, overflow, and human preference with a rubric.

That comparison has **not** been run here. In particular, this project should not be called “better” or “superior” without it. Some comparison candidates require paid model APIs; no API spend is authorized or assumed.

## Three projects to reproduce or study next

These are recommended follow-up experiments, **not completed reproductions**:

1. **Presentation Forge** ([README](https://github.com/Deepnar/presentation-forge/blob/main/README.md)): reproduce the content-schema → deterministic layout boundary with one short outline. Its documented local-model option may avoid a paid API, but dependencies and runtime still need an isolated review.
2. **slide-wright** ([README](https://github.com/arifszn/slide-wright/blob/main/README.md), [skill](https://github.com/arifszn/slide-wright/blob/main/slide-wright/SKILL.md)): compare preview-first user approval and native-vs-flattened export. Use a short deck and inspect every object in the PPTX.
3. **slides_maker** ([README](https://github.com/addsumtech/slides_maker/blob/main/README.md)): test speaker notes and native chart/editability with the same synthetic dataset used in `examples/data-report.json`.

Before any reproduction: inspect the exact dependency lockfile, transitive scripts, license and assets; install only in a disposable isolated environment; and record the precise prompt/model/configuration. None was executed as part of this research.

## Name and public-release status

GitHub repository search on 2026-11-02 returned multiple existing projects named `SlideForge`/`slideforge-ai` (including `vincenzo-afk/SlideForge` and `xiejhhhhhh/slideforge-ai`); npm search also returned `slideforge`. The user-proposed name remains a working title only and is **not cleared for public use**. This search is not trademark advice. Choose a distinct name and perform a proper name/package/trademark review before publishing.
