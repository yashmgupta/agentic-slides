# Cross-platform prompt and skill compatibility

The presentation JSON contract and authored prompts are model-independent. Skill discovery and structured-output controls are not. This comparison describes practical adaptation paths; prompts were not run against commercial model APIs during this project.

| Platform | Reuse the master prompt? | Skill installation | Structured output route | Practical caveat |
|---|---|---|---|---|
| ChatGPT | Paste the master prompt into a chat; upload/paste source material | No universal `SKILL.md` installation is claimed; paste instructions into the supported custom instruction/GPT workflow | Use any JSON/structured-output control available to the user's plan, then run local validation | Interface features vary by model and account; output must be validated |
| Claude chat | Paste the model-neutral prompt | Plain Markdown is reusable as instructions, but chat is not assumed to load a coding-agent skill folder | Request JSON only; validate locally | A chat prompt is distinct from Claude Code skill discovery |
| Claude Code | Paste prompt or invoke skill instructions | The file follows common `name`/`description` skill frontmatter; project-level `.claude/skills/presentation-generator/SKILL.md` is the documented adaptation path to verify against current Claude Code docs | Agent can write JSON to a local file; toolkit validation remains authoritative for structure | Commands, permissions, and personal skill locations can change between versions |
| Gemini chat | Paste prompt in a conversation or supported custom instruction/Gem | No cross-vendor `SKILL.md` installer is claimed | Ask for a single JSON object; use local validator | Do not assume a custom Gemini instruction automatically runs local Node scripts |
| Other coding agents | Reuse the JSON contract and master prompt | Adapt `AGENTS.md`/skill placement to each agent’s documented conventions | Agent writes a spec; run CLI outside the model loop | Prompt portability does not imply execution/tool portability |

## Portable core

1. State audience, outcome, and story arc.
2. Ask for the documented JSON object only.
3. Keep facts and chart values tied to user-supplied evidence.
4. Put nuance in speaker notes.
5. Run the same local `validate`, `qa`, and `generate` commands regardless of which model drafted the file.

## Documentation verification status

The official Anthropic, OpenAI, and GitHub skill documentation endpoints were not reachable in this research environment. The frontmatter and skill body were checked locally for the expected fields and commands, and the format is informed by publicly accessible repository examples; **platform-specific installation has not been independently certified against current first-party documentation**. Recheck the [Claude Code skills docs](https://docs.anthropic.com/en/docs/claude-code/skills), [OpenAI Codex skills docs](https://developers.openai.com/codex/skills/), and relevant GitHub Copilot skill docs before publishing installation instructions.
