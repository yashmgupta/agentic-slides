# Validation and benchmark record

**Run date:** 2026-11-02. This report separates toolkit validation from competitive benchmarking. No unsupported “better than” claim is made.

## Local sample outputs

| Test deck | Required / generated slides | PPTX | HTML | Source values verified |
|---|---:|---|---|---|
| Business pitch (fictional) | 10 / 10 | Generated | Generated | One native chart contains 60, 32, 8 |
| Educational overview | 8 / 8 | Generated | Generated | No chart |
| Data presentation (synthetic) | 6 / 6 | Generated | Generated | Native charts contain 42, 48, 47, 61, 68 and 18, 12, 9, 6 |

Generated artifacts are in [`examples/generated/`](../examples/generated/); inputs are in [`examples/`](../examples/).

## Automated checks performed

- `npm ci --ignore-scripts --no-audit --no-fund`: dependency install from lockfile succeeded.
- `npm test`: **7 tests passed, 0 failed**. Tests validate all three specs/counts, reject invalid chart/type/font input, check heuristic contrast, verify HTML escaping/navigation, check skill frontmatter and CLI help, unpack all PPTX archives, verify native slide and notes structures, compare chart XML to input values, and check HTML slide counts.
- `node src/cli.js validate --input ...`: passed for each sample.
- `node src/cli.js generate ...`: generated all six output files.
- PPTX ZIP package integrity: `unzip -t` passed for all three outputs as part of the test suite.
- All 24 HTML slides were opened in local Chrome and checked for content-area and element-bound overflow at 1280×720 and 375×812 viewports; none was detected in those samples. This is a geometry/scroll check, not an aesthetic score. The Northstar title and data chart were visually inspected; next-slide navigation moved to `2 / 6`, and the chart screenshot displayed the synthetic source label and values. Actual screenshots are [`northstar-title.png`](../assets/northstar-title.png) and [`data-chart.png`](../assets/data-chart.png).

## What this does not prove

- The PPTX files were structurally inspected, but not visually rendered in PowerPoint or LibreOffice. LibreOffice was not found in the initial environment inspection. Font substitution, object rendering, and clipping in Office remain manual release checks.
- HTML browser screenshots are not PowerPoint screenshots.
- The examples test the renderer; they are not evidence of truthful startup metrics, customer data, or model factuality.
- Heuristic QA does not measure rendered text boxes or judge aesthetic quality.
- PDF export, multi-agent behavior, source citations, and automatic visual repair were not tested or implemented.

## Comparison with existing open-source tools

| Candidate | Same prompt/spec executed? | What is compared here | Limitation |
|---|---|---|---|
| [Presentation Forge](https://github.com/Deepnar/presentation-forge) | No | Documentation describes schema-constrained content, deterministic layout, outline approval, and visual review; these patterns informed our design | Third-party dependencies/code were not reviewed and run in an isolated environment; model setup would be needed for its generation path |
| [slide-wright](https://github.com/arifszn/slide-wright) | No | Documentation describes preview-first approval and notes/editability tradeoffs across HTML/PPTX/PDF | No same-brief output or editability test was performed |
| [slides_maker](https://github.com/addsumtech/slides_maker) | No | Documentation advertises native charts and speaker notes—features tested structurally in our own outputs | Its repository was not installed or executed; README claims were not independently reproduced |

The requested same-brief competitive benchmark is **not completed**. It was deferred because this environment had no validated isolated third-party runner configured, and no paid model access was used. A proper follow-up must inspect exact dependencies and asset licenses, isolate each tool, hold prompt/source/model settings constant, and record actual output quality, time, cost, failures, and object editability. See [opportunity analysis](opportunity-analysis.md#comparison-plan-and-limits).

## Reproducible next test

Use the exact synthetic source table in `examples/data-report.json` and a neutral brief: “Create a six-slide service-usage report; chart the monthly team counts and support categories exactly; label data synthetic; include notes and a closing.” Review each project’s license and dependency scripts, then score:

1. Slide count and source data fidelity.
2. PPTX archive validity and number/type of editable objects.
3. Whether notes are embedded.
4. Text overflow and chart label readability in the same office renderer.
5. Setup steps, required services, API/model cost, and reproducibility.

Do not treat star counts or generated showcase screenshots as comparable output evidence.
