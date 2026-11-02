# Make an Editable PowerPoint and HTML Deck in ChatGPT, With One Link and a Few Answers

*Free. No API key. No coding needed to get started.*

Most AI slide tools give you plain text, or a deck you can't edit. I wanted a simple, repeatable way to get a real PowerPoint file and a web-ready deck from a chat.

I built **Agentic Slides**, an open-source toolkit with copy-paste prompts. In my test, I gave ChatGPT the repo link. It followed the workflow and gave me structured JSON. When I asked for PPT and HTML, it produced both.

## The 3-step workflow

**1. Give ChatGPT the link and start the interview**

```text
Read https://github.com/yashmgupta/agentic-slides (README and prompts/interactive-intake.md) and follow its interview-first workflow. Ask me your questions first, wait for my answers, show an outline, and only then build the deck.
```

ChatGPT will ask about:
- Topic, audience and slide count
- Style, colors and fonts
- Tone and speaker notes

Answer briefly. You can say "you choose" to anything.

**2. Approve the outline, then get the JSON**

Reply "approved". ChatGPT gives you the whole deck as structured JSON: titles, content, theme and notes.

**3. Ask for the files**

```text
Now create the editable PowerPoint (.pptx) and a self-contained HTML version of this deck, and give me download links.
```

You get:
- **PPTX:** open it in PowerPoint and edit it.
- **HTML:** open it in any browser and use the arrow keys to move between slides.

## 6 prompts to try (fill in the brackets)

1. **Startup pitch:** "Create a 10-slide investor pitch for [product]. Audience: [investors]. Include problem, solution, market, traction [my numbers], business model and ask. Style: dark-modern."
2. **Lesson:** "Make an 8-slide beginner lesson on [topic] for [level]. One idea per slide, a simple analogy, a recap quiz and speaker notes."
3. **Data report:** "Turn this data into a 6-slide report with one bar chart: [paste data]. Use only my numbers and label units."
4. **Team update:** "Build a 7-slide weekly update: wins, metrics, risks, next steps. Formal tone, Calibri."
5. **Product launch:** "Create a 6-slide launch for [feature]: problem, what's new, how it works in 3 steps, quote placeholder, call to action."
6. **Talk:** "Draft a 12-slide, 20-minute talk on [topic] with a story arc and a takeaways slide."

## Want exact, consistent output?

Chat results can vary between runs. For consistent files, save the JSON as `my-deck.json` and run it through the toolkit on your computer. This needs Node 20+.

```bash
git clone https://github.com/yashmgupta/agentic-slides
cd agentic-slides
npm install
node src/cli.js validate --input my-deck.json
node src/cli.js generate --input my-deck.json --out out
```

The `validate` step catches errors in the JSON before you export.

## Tips and limits

- Ask ChatGPT to use placeholders like "[add figure]" instead of inventing numbers.
- Check every fact and chart value yourself.
- Open the file before presenting. Fonts you choose must be installed on your computer.
- The toolkit supports bar charts only, and there is no PDF export yet.
- ChatGPT's browsing and file features differ by plan and over time. If it can't open the link, paste the contents of `prompts/interactive-intake.md` instead.

## Try it

**https://github.com/yashmgupta/agentic-slides** (MIT license, three sample decks included). A star helps others find it.

*Disclosure: this post and the toolkit were created with AI assistance and reviewed by the author.*

---

<!-- Before publishing: add a screenshot of your ChatGPT conversation and one of your generated deck. Check Medium's current AI-content rules. -->
