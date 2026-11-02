# Deep analysis of ten presentation projects

**Evidence standard:** This is documentation-level analysis. “The project documents” attributes a claim to the linked source; it is not an independent benchmark. Repository source code was not executed. The fields below distinguish declared workflows from features not verified in the material reviewed.

## 1. Presenton — product-scale, self-hosted AI presentation generation

- **Architecture evidence:** [Repository README](https://github.com/presenton/presenton) describes a self-hostable AI presentation app and API. The README retrieved during discovery was too large to inspect completely, so internal outline/layout/export components are **not verified** here.
- **Request → outline → slides:** Product-level topic/source input is described; exact outline schema and layout selection rules need a source-code pass.
- **Graphics/charts:** Not established by the inspected excerpt.
- **Exports/editability/notes:** PPTX is advertised; whether each visual object is native/editable and how notes are represented was not independently verified.
- **Accuracy, QA, recovery:** No measured factuality/overflow results established in this review.
- **Agent portability:** API/self-hosting offers integration potential, but a packaged cross-agent skill was not confirmed.
- **What to learn:** A useful product/API boundary and self-hosted deployment story. **What not to infer:** that advertised outputs are superior or all slide elements are editable.

## 2. Presentation Forge — schema-first content, deterministic layout

- **Architecture evidence:** [README](https://github.com/Deepnar/presentation-forge/blob/main/README.md) documents a content schema and deterministic code-owned layout, local Ollama or bring-your-own-key, an outline approval point, and rendered-slide review.
- **Request → outline → slides:** Topic/source requirements lead to an outline; after approval, model-generated structured slide content is passed to the renderer. The model does not own absolute coordinates.
- **Layout/graphics:** Layout is selected and implemented by code; the README describes a broad slide-type/theme library. Specific chart accuracy guarantees were not independently checked.
- **Export/editability/notes:** Editable PPTX is a product output; speaker-note handling was not confirmed in the inspected source.
- **Accuracy/QA:** Visual review is in the documented workflow. No independent score was reproduced.
- **Agent portability:** Provider choices are less coupled to a paid model, but no universal skill interface was verified.
- **Takeaway:** Use a constrained presentation specification and make layout deterministic; model output should not be raw slide geometry.

## 3. ppt-agent — source-grounded content and numeric checks

- **Architecture evidence:** [README](https://github.com/Liyilin66/ppt-agent/blob/main/README.md) documents document parsing, chapter identification, outline planning, per-slide source retrieval, structured JSON content, source/numeric checks, code-owned layout, and editable PPTX. It also documents CLI, web, and local stdio MCP access.
- **Request → outline → slides:** Pages are planned by section; source passages are retrieved for each slide; the model writes structured content, while program code controls layout.
- **Charts/graphics:** Layout variety is planned up front; the README states that chart layouts are assigned only where source data exists.
- **Export/editability/notes:** Native editable text/shapes/charts are claimed in the README; note support was not confirmed in the inspected excerpt.
- **Accuracy/QA:** Citation checks validate file/page availability; numeric checks compare values with source passages. Project-published tests report known false-positive/negative limits and are not independently rerun. README documents known limitations including Chinese-report-centered testing, scanned PDFs, and difficult table extraction.
- **Agent portability:** Local MCP tools are documented for Claude Code, Codex, and Cursor; generation still runs through the app’s fixed pipeline.
- **Takeaway:** Keep provenance with each claim and distinguish “number exists” from “number matches the label.” For an MVP, source citation semantics are a later, more demanding feature than structural validation.

## 4. slide-wright — visual approval before full generation

- **Architecture evidence:** [Repository README](https://github.com/arifszn/slide-wright/blob/main/README.md) and [skill](https://github.com/arifszn/slide-wright/blob/main/slide-wright/SKILL.md) describe a preview-first flow; Claude-oriented installation metadata lives under `slide-wright/.claude-plugin/`.
- **Request → outline → slides:** The skill describes a style/preview stage followed by deck creation after user acceptance.
- **Layouts/graphics:** Browser-based visuals support design flexibility. The exact model prompt and script internals were not executed here.
- **Export/editability/notes:** README lists HTML/PPTX/PDF export. It explicitly describes limitations: some backgrounds, charts, and images may be flattened, while PPTX text/notes can remain editable.
- **Accuracy/QA:** Preview approval gives a human visual gate; automated factual validation was not established.
- **Agent portability:** Claude skill packaging is platform-specific; the underlying brief and output content are more portable than installation metadata.
- **Takeaway:** Ask for visual approval before committing to a lengthy render, but expose a no-gate/batch mode to automation users.

## 5. slides_maker — native PowerPoint objects and review

- **Architecture evidence:** [README](https://github.com/addsumtech/slides_maker/blob/main/README.md) describes source material ingestion, template/design guidance, editable PPTX with native charts/equations, speaker notes, build animations, and independent critic review. A skill directory is present at [`skills/slide-maker/`](https://github.com/addsumtech/slides_maker/tree/main/skills/slide-maker).
- **Request → outline → slides:** Agent workflow accepts papers, code, and docs; exact parser and intermediate schema were not inspected in this pass.
- **Graphics/charts:** Native PowerPoint charts and elements are explicitly advertised.
- **Export/editability/notes:** PPTX, editable native objects and speaker notes are explicit README claims.
- **Accuracy/QA:** Critic review is documented; no independent content or rendering results were rerun.
- **Agent portability:** Codex/Claude Code usage documented; generalizing to another agent requires adapting invocation conventions.
- **Takeaway:** Native editing and speaker notes are important delivery features, but need inspection in the actual produced PPTX, not only README claims.

## 6. PPTskill / `ppt-master` — serial SVG content-to-PPT workflow

- **Architecture evidence:** [Skill file](https://github.com/AIPMAndy/PPTskill/blob/main/skills/ppt-master/SKILL.md) documents source conversion → project/template choice → strategist/design specification → optional image generation → SVG page authoring → post-processing → PPTX export. Scripts include quality-check, notes split, SVG finalize, and PPTX export.
- **Request → outline → slides:** The skill requests eight design confirmations and emits a design specification before page authoring. Its documented workflow includes hard user gates and serial generation.
- **Graphics/layout:** SVG layouts/icons/charts are template-indexed; generated SVG pages are post-processed.
- **Export/editability/notes:** PPTX export is supported; speaker notes are split and embedded. The skill describes multiple export modes, including native shapes and SVG references.
- **Accuracy/QA:** Quality check and post-processing scripts are listed; design quality still depends on human/agent review. The README names upstream `ppt-master`; source provenance/license compatibility should be respected.
- **Agent portability:** Markdown skill concepts transfer, but scripts and installation assumptions are repo-specific.
- **Takeaway:** Detailed gates and a deterministic export chain improve reproducibility; mandatory serial constraints can be too rigid for unattended generation.

## 7. Kami — broad document and slide skill system

- **Architecture evidence:** [`skills/kami/SKILL.md`](https://github.com/tw93/Kami/blob/main/skills/kami/SKILL.md) and [README](https://github.com/tw93/Kami/blob/main/README.md) describe a skill with scripts, references and assets, including document/slide workflows and multiple formats.
- **Request → outline → slides:** Skill guides the agent through authoring and rendering; exact path depends on selected document type.
- **Graphics/layout:** HTML/Marp and other document presentation formats are part of the described toolset; branded profiles are mentioned by README.
- **Export/editability/notes:** PDF/HTML/Marp paths and optional PPTX are described; editability varies by output path. Do not equate PDF/image layers with editable PPTX.
- **Accuracy/QA:** Visual review is part of the workflow; no source-grounded factual verification benchmark was established here.
- **Agent portability:** Skill packaging targets multiple coding agents; tool installation and command syntax are still client-specific.
- **Licensing:** GitHub reports repository MIT; README documents third-party fonts/assets with separate restrictions.
- **Takeaway:** Build skills as portable instructions plus ordinary scripts, but make format tradeoffs explicit.

## 8. LearnDeck — education-first presentation authoring

- **Architecture evidence:** [README](https://github.com/LearnAIHubC/LearnDeck/blob/main/README.md) describes a Codex-oriented workflow and editable PPTX templates.
- **Request → outline → slides:** Topics, notes, course material and outlines feed an educational deck workflow; exact schema was not deeply inspected.
- **Graphics/layout:** Education-oriented templates are documented; chart-generation and accuracy internals are not established.
- **Export/editability/notes:** Editable PPTX is the stated goal; note and rendering behavior need output-level confirmation.
- **Accuracy/QA:** Pedagogical framing is not equivalent to factual verification. No independent evidence test performed.
- **Agent portability:** Workflow instructions can be adapted, while Codex skill packaging is platform-specific.
- **Takeaway:** Pedagogical slide structure is a valuable distinct mode; generic “business deck” prompts do not serve this need.

## 9. Excalidraw Slides — dual-layer HTML rendering

- **Architecture evidence:** [Repository docs](https://github.com/danny0926/ppt-skills) describe an outline → style/layout plan → per-slide HTML → Playwright PNG rendering and visual review → PPTX assembly workflow.
- **Request → outline → slides:** Skill recommends one message per slide, concise headlines, visual density rules, and layout variety.
- **Graphics/layout:** Rough.js/rough-notation and style presets; slides can be rendered full-preview and background-only.
- **Export/editability/notes:** Dual-layer PPTX places rendered background imagery under native editable elements; image-only mode is also supported. Exact preservation of every item is not claimed.
- **Accuracy/QA:** Human visual inspection is explicit; no automated content-truth check was verified.
- **Agent portability:** Skill content is transferable, but Python/Playwright/browser and `python-pptx` prerequisites are concrete.
- **Takeaway:** Visual-first composition and a rendered review loop are valuable; layered editability introduces alignment/maintenance complexity.

## 10. PPT Agent Skill — style library and HTML-to-PPTX path

- **Architecture evidence:** [README](https://github.com/Akxan/ppt-agent-skill/blob/main/README.md) describes a Claude Code skill with multiple styles, charts, and HTML/editable-PPTX output.
- **Request → outline → slides:** Single-brief workflow is documented; its prompt asks the agent to structure and design rather than merely fill fixed bullet templates.
- **Graphics/layout:** Project advertises a large style/chart/layout library; these are project claims, not independently benchmarked in this report.
- **Export/editability/notes:** HTML plus editable PPTX is stated. How much of each exported slide remains native was not measured.
- **Accuracy/QA:** README describes benchmark comparisons; no same-brief tests were rerun, so results are not used as comparative evidence here.
- **Agent portability:** Designed for Claude Code; prompt and design principles can be adapted, but scripts/skill installation are not universally portable.
- **Takeaway:** Design-system breadth is useful, but a smaller deterministic set of well-tested layouts can be a better MVP than a large unverified template catalog.

## Cross-project findings

1. The strongest recurring engineering pattern is **structured content, deterministic layout**. It limits model control to content/semantic choices and makes output repeatable.
2. **Native PPTX** and **HTML-first visuals** are different engineering routes. Dual-layer exports can compromise editability; state exactly which objects stay editable.
3. There are several visual QA strategies—preview approval, screenshot inspection, reviewer/critic agents, deterministic bounds checks—but they are not interchangeable. Automated geometry checks cannot judge narrative or aesthetics.
4. Source-grounded generation is distinctly more complex than outline-to-slides; claims about citation quality need provenance checks and a test set.
5. Prompt/skill installation is agent-specific. The useful core should be plain Markdown plus a documented input schema and local CLI, not a mandatory proprietary skill mechanism.
6. This review did not install or run any of the researched projects and does not report comparative output scores.
