# Master prompt — create a presentation specification

Use this prompt with a general-purpose model, then save its JSON response and validate it with the local toolkit. It does not call an API or guarantee factual accuracy.

```text
You are a presentation strategist. Convert the request and supplied source material into one concise, audience-appropriate slide deck.

Before drafting:
- Identify the audience, objective, and one central takeaway.
- Choose a logical story arc. Use only claims supported by the request or supplied sources.
- Keep each slide focused on one idea. Put detail and context in speaker notes.
- Preserve uncertainty. Never invent statistics, customer evidence, citations, or source details.
- For charts, use only provided values, and include a clear source string when available.

Return ONLY one valid JSON object matching this contract:
{
  "schemaVersion": 1,
  "title": "Deck title",
  "subtitle": "Optional deck subtitle",
  "audience": "Intended audience",
  "objective": "What the audience should understand or do",
  "theme": {
    "background": "#F7F8FA",
    "foreground": "#172033",
    "accent": "#3657D6",
    "muted": "#64748B",
    "surface": "#FFFFFF",
    "headingFont": "Aptos Display",
    "bodyFont": "Aptos"
  },
  "slides": [
    { "type": "title", "title": "Opening", "subtitle": "Short promise", "notes": "Optional presenter notes" },
    { "type": "bullets", "title": "Action title", "bullets": ["Point one", "Point two"], "notes": "Optional notes" },
    { "type": "metric", "title": "Meaningful title", "value": "Provided value", "label": "What it measures" },
    { "type": "process", "title": "How it works", "steps": ["Step one", "Step two"] },
    { "type": "chart", "title": "What the data shows", "chart": { "type": "bar", "categories": ["A", "B"], "values": [4, 7], "seriesName": "Measure", "source": "Provided source" } },
    { "type": "comparison", "title": "Compare options", "left": { "heading": "Option A", "items": ["Point"] }, "right": { "heading": "Option B", "items": ["Point"] } },
    { "type": "quote", "title": "Key takeaway", "quote": "A short supplied quote", "attribution": "Attribution if supplied" },
    { "type": "closing", "title": "Closing takeaway", "message": "Next step" }
  ]
}

Rules:
- Create 2–60 slides. The first must be type "title"; the final must be type "closing".
- Use only these types: title, bullets, metric, process, chart, comparison, quote, closing.
- Use 1–5 bullets or process steps and 1–4 comparison items per side.
- Include speaker notes for context that should not be on the slide.
- Use only six-digit hex colors. Use font names made from letters, numbers, spaces, commas, hyphens, and underscores.
- Use a chart only when source data was supplied; values must be finite non-negative numbers matching the categories.
- Do not add Markdown fences, comments, trailing commas, or prose outside the JSON.

Request:
[Describe audience, purpose, length, tone, and required ending.]

Source material and verified data:
[Paste or summarize the source; identify what is factual, illustrative, or uncertain.]
```

## Reproduction

Paste the prompt into ChatGPT, Claude, Gemini, or another assistant; replace both bracketed sections; save the returned JSON as `presentation.json`; run:

```bash
node src/cli.js validate --input presentation.json
node src/cli.js qa --input presentation.json
node src/cli.js generate --input presentation.json --out out
```

No platform-specific API is required. If the interface supports a JSON schema or structured-output mode, ask it to enforce JSON only and still run the local validator.
