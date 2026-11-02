# Installation

## Requirements

- Node.js 20 or newer.
- npm.
- PowerPoint, LibreOffice, or another Office-compatible application to open/edit `.pptx` files. None is needed to generate files.
- A modern browser to view the HTML file.

No model API key, database, Docker daemon, paid subscription, or internet access is required after dependencies have been installed.

## Setup

```bash
git clone https://github.com/yashmgupta/agentic-slides
cd agentic-slides
npm install
npm test
```

This repository is not published yet; the clone command is illustrative. For a local checkout, `cd` to its folder and run `npm install`.

## Generate a sample

```bash
npm run generate -- --input examples/business-pitch.json --out examples/generated
```

The command writes a `.pptx` and `.html` file under the selected output directory. Generated sample files are included in this local deliverable but may be regenerated at any time.

## Skill installation

`skills/presentation-generator/SKILL.md` is plain Markdown with the common `name`/`description` frontmatter pattern. For Claude Code, copy the folder to `.claude/skills/presentation-generator/` in the project or the user-level skills directory supported by the installed version. For Codex, follow the current [Codex skills documentation](https://developers.openai.com/codex/skills/) and place it in the documented skills directory. Exact discovery paths and commands are platform/version specific; no universal installer is claimed. GitHub Copilot and other agents can use `AGENTS.md` or the skill body as instructions, subject to each product's current conventions.

The official documentation pages were not reachable in this research environment. Verify platform-specific installation instructions against the linked docs before distributing an install guide.
