# Medium content plan

These are proposed educational articles, not reports of experiments already performed. Article screenshots should be captured from actual local output after the author reruns the described workflow. No first-person testing or performance claim should be invented. Attribute third-party inspiration through links and descriptions; do not republish their prompts, images, decks, or code without checking each license.

## 1. Turn a plain-language brief into an editable PowerPoint with JSON

- **Reader problem:** AI slides often look polished but are hard to edit or regenerate consistently.
- **Reusable prompt/skill:** `prompts/master-presentation-prompt.md` and `skills/presentation-generator/SKILL.md`.
- **Example output:** 10-slide Northstar demonstration deck; clearly label its numbers as fictional.
- **Tools:** Node.js 20+, local toolkit, optional ChatGPT/Claude/Gemini.
- **Tutorial outline:** Define the brief → ask for schema-only JSON → validate → run QA → export → inspect PPTX.
- **Screenshots:** CLI output, example JSON, one HTML slide, corresponding editable PPTX view.
- **Repository files:** README, prompt, spec validator, Northstar example.
- **Attribution:** Link to the Presentation Forge schema/layout pattern and PptxGenJS; state that no code was copied.
- **Invitation:** Download the local starter and adapt the JSON prompt.

## 2. A copy-paste prompt for a beginner-friendly AI lesson deck

- **Reader problem:** Explanations become too dense or oversimplify important limits.
- **Reusable prompt/skill:** `prompts/educational-slides.md`.
- **Example output:** Eight-slide introduction to language models.
- **Tools:** Any LLM that can return JSON, plus local Node toolkit.
- **Tutorial outline:** Choose learning objective → define terms → build concept progression → add misconception → validate → review.
- **Screenshots:** Prompt, slide sequence, speaker notes, one comparison slide.
- **Repository files:** Educational prompt, `examples/educational-ai.json`, generated HTML/PPTX.
- **Attribution:** Link to LearnDeck and academic slide skills as adjacent work; do not imply endorsement.
- **Invitation:** Copy the prompt, substitute a concept, and fact-check it.

## 3. Build a chart slide without allowing the model to invent data

- **Reader problem:** A generated chart may not match the user's source numbers.
- **Reusable prompt/skill:** `prompts/data-presentation.md` plus the chart schema.
- **Example output:** Six-slide report using explicitly synthetic counts.
- **Tools:** JSON editor, toolkit, spreadsheet or verified source data.
- **Tutorial outline:** Preserve values → state units/source → validate matching arrays → compare XML/chart labels → inspect result.
- **Screenshots:** Input values, HTML chart, PPTX chart editing interface.
- **Repository files:** Data prompt, `data-report.json`, `src/spec.js`, chart tests.
- **Attribution:** Link to source-grounded projects such as ppt-agent and accurately distinguish their research retrieval from this local renderer.
- **Invitation:** Use real data only after verifying its source and definitions.

## 4. Make a 10-slide pitch deck from a strict evidence-aware outline

- **Reader problem:** Startup prompts fabricate traction, market sizes, or customer quotes.
- **Reusable prompt/skill:** `prompts/pitch-deck.md`.
- **Example output:** Northstar deck with clearly labeled assumptions.
- **Tools:** LLM, local toolkit, founders' actual source materials.
- **Tutorial outline:** Define customer → separate evidence from hypothesis → assemble story → use notes for caveats → review every claim.
- **Screenshots:** Example JSON assumptions, title/process/closing slides, QA terminal.
- **Repository files:** Pitch prompt, sample JSON, spec validator.
- **Attribution:** Link to the repository landscape; do not present invented example as a real startup.
- **Invitation:** Start with the prompt and replace every illustrative claim with verified input.

## 5. Use AI for content while keeping slide layout deterministic

- **Reader problem:** Free-form slide code is inconsistent and brittle.
- **Reusable prompt/skill:** Master prompt returns content fields; renderer owns geometry.
- **Example output:** Same JSON exported to both PPTX and HTML.
- **Tools:** LLM (optional), JSON schema, PptxGenJS.
- **Tutorial outline:** Explain the boundary → inspect schema → change text → rerun → compare output forms.
- **Screenshots:** Schema, PPTX editing objects, HTML output.
- **Repository files:** Architecture, feature spec, renderers, example inputs.
- **Attribution:** Cite Presentation Forge as a documented inspiration for structured content and deterministic layout.
- **Invitation:** Fork the schema, not a third-party codebase, and document your own changes.

## 6. Create an HTML slide deck you can navigate offline

- **Reader problem:** Slide previews depend on a hosted service or an account.
- **Reusable prompt/skill:** Educational or business prompt; renderer emits self-contained HTML.
- **Example output:** Browser deck with keyboard controls and print CSS.
- **Tools:** Node.js and a modern browser.
- **Tutorial outline:** Generate → open locally → navigate by keyboard → inspect notes → print preview.
- **Screenshots:** Chrome title slide, chart slide, slide counter, print preview.
- **Repository files:** `src/render-html.js`, generated HTML, usage docs.
- **Attribution:** Link to HTML-first slide skills (e.g., slide-wright) and explain distinct implementation.
- **Invitation:** Try the sample file offline.

## 7. Add speaker notes without crowding the slide

- **Reader problem:** Important context is lost when slides are reduced to terse headlines.
- **Reusable prompt/skill:** Master prompt asks for notes and concise slide content.
- **Example output:** Notes in the educational deck explaining simplifications.
- **Tools:** JSON editor, PowerPoint or compatible viewer.
- **Tutorial outline:** Identify on-slide message → move nuance to notes → export → open notes pane → verify.
- **Screenshots:** JSON `notes` field, PPTX notes pane, HTML disclosure.
- **Repository files:** `src/render-pptx.js`, skill, educational sample, test.
- **Attribution:** Mention the slides_maker and PPTskill projects as examples documenting notes support.
- **Invitation:** Add notes to an existing JSON presentation.

## 8. Write an agent skill that does not require a proprietary API

- **Reader problem:** A prompting workflow is difficult to repeat across AI tools.
- **Reusable prompt/skill:** `skills/presentation-generator/SKILL.md`.
- **Example output:** Valid JSON produced with any LLM and rendered locally.
- **Tools:** A compatible agent, Markdown skill file, Node.js.
- **Tutorial outline:** Skill frontmatter → inputs and boundaries → CLI workflow → platform-specific installation caveat → validation.
- **Screenshots:** Skill file, one prompt response, local CLI output.
- **Repository files:** SKILL.md, prompts, AGENTS.md, installation docs.
- **Attribution:** Link to official platform skill docs and clearly note supported installation paths vary.
- **Invitation:** Adapt the Markdown instructions to your agent; validate current platform requirements.

## 9. Build a data brief that distinguishes evidence from explanation

- **Reader problem:** A chart trend is often presented as a causal conclusion.
- **Reusable prompt/skill:** Data prompt requires observation, interpretation, and caveats to be separated.
- **Example output:** Synthetic activity trend and labeled source.
- **Tools:** Spreadsheet/data source, prompt, toolkit.
- **Tutorial outline:** Define metric → validate source → plot exact values → separate observation from hypothesis → state next analysis.
- **Screenshots:** Source table, generated chart, notes with limitations.
- **Repository files:** Data prompt and data example.
- **Attribution:** Link to data visualization standards as researched by the writer; do not claim the toolkit verifies causality.
- **Invitation:** Replace synthetic values with approved data and retain definitions.

## 10. Run a small, fair benchmark of presentation tools

- **Reader problem:** Star counts and showcase images do not tell users which workflow fits their needs.
- **Reusable prompt/skill:** A fixed brief plus the same source facts; publish the exact prompt and scoring rubric.
- **Example output:** A measured comparison across editability, chart fidelity, overflow, and setup—not an assumed winner.
- **Tools:** Two or more licensed projects, isolated installs, disclosed model/API access, same brief.
- **Tutorial outline:** Pick tools → check licenses → freeze inputs/models → generate → score blindly if possible → report failures and costs.
- **Screenshots:** Exact prompts, dependency versions, output screenshots, scoring sheet.
- **Repository files:** Research candidate table and benchmark plan; results only after an actual run.
- **Attribution:** Cite each project, license, prompt, and asset; obtain permission if terms require it.
- **Invitation:** Reproduce the benchmark or submit a documented result.

## Editorial and monetization notes

Medium's current content and partner-program policy pages were not reachable during this research pass, so this plan is **not a verified policy interpretation**. Before publishing or monetizing, read Medium's official rules then in force, especially AI disclosure, AI-generated content eligibility, and Partner Program requirements. Label AI-generated or AI-assisted material as required by those rules. Verify claims, citations, images, and licenses yourself. Do not claim personal tests, original research, outcomes, earnings, or endorsements that did not happen. Potential products should be educational templates or checklists, not repackaged third-party prompts/assets.

## Downloadable product concepts

1. JSON presentation-spec starter pack with editable themes and examples.
2. Evidence-aware pitch-deck worksheet and source/assumption tracker.
3. Beginner-education slide planning cards and prompt sheet.
4. Offline HTML/PPTX generation quick-reference guide.
5. A fair presentation-tool comparison rubric and experiment log.

Each can be distributed only after confirming included content is original or appropriately licensed.
