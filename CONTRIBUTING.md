# Contributing

Thanks for helping improve this local-first presentation toolkit.

## Development

1. Install Node.js 20+ and run `npm install`.
2. Make changes to source, prompts, docs, or examples.
3. Run `npm test`.
4. For schema/renderer changes, regenerate all three examples:

   ```bash
   for file in examples/business-pitch.json examples/educational-ai.json examples/data-report.json; do
     node src/cli.js generate --input "$file" --out examples/generated
   done
   ```

5. Review the rendered HTML and PPTX; do not rely solely on automated checks.

## Guidelines

- Keep the versioned schema explicit and model-neutral.
- Do not add a mandatory API key, paid service, or network dependency for the no-model path.
- Treat factual accuracy, source quality, and visual design as review tasks.
- Include tests for invalid input and expected export output.
- Do not add third-party assets or copy prompts/code without checking their license and attribution requirements.
- Do not add real credentials, customer data, or sensitive presentation content to examples.

## Reporting issues

Include Node.js version, operating system, exact command, a minimal non-sensitive JSON example, and the complete error output. Mention which viewer you used if rendering differs.
