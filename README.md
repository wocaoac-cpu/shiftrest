# ShiftRest

**Your shift tells you when to clock in. ShiftRest tells you when to sleep — free, private, in your browser.**

🔗 **Live: https://sr-6k5.pages.dev**

Night and rotating shifts wreck your body clock, and most advice is generic ("sleep in a dark room!"). ShiftRest turns *your* shift times into a concrete, visual **24-hour plan**: your main sleep window, when to seek bright light, when to wear sunglasses on the commute home, when to stop caffeine, and whether to nap before your shift — based on Sleep Foundation / CDC shift-work guidance.

Built for the ~1 in 5 workers on non-standard hours — nurses, doctors, factory & logistics, security, hospitality, emergency services — who are badly underserved by sleep apps.

## What it does

- **Your main sleep window** — the headline: e.g. *Sleep 08:15 – 15:45*, sized to your shift and chosen sleep length.
- **A visual 24-hour timeline** — sleep, wind-down, light-seeking, sunglasses/dark, caffeine cutoff and pre-shift nap, all mapped on one axis (events that cross midnight wrap correctly).
- **Why, for each block** — short, sourced reasons so you understand the plan, not just follow it.
- **Adapts to your shift type** — night / evening / early / day each get a different strategy (e.g. night shifts sleep *after* work; early shifts sleep *before*).
- **Private** — your schedule never leaves your browser. No upload, no account, no tracking.
- **Trilingual** — English / 中文 / Українська.

## How it works (deterministic, no AI)

Pure time math: from your shift start/end it derives the sleep window (post-shift for night/evening, pre-shift for early/day), a caffeine cutoff (~6h before sleep), a light-seeking window (first half of the shift), a light-avoidance window (after a night shift, into morning light), an optional pre-shift nap, and a wind-down. Everything is computed in minutes-of-day with correct overnight wrapping.

## Project structure

```
index.html      UI, midnight theme, visual timeline, trilingual scaffold
engine.js       Deterministic circadian-plan engine (no deps; browser + Node)
app.js          i18n, timeline rendering, localized explanations, copy-plan
test.mjs        60 assertions
test_codex.mjs  15 adversarial edge-case assertions
```

## Run the tests

```bash
node test.mjs
node test_codex.mjs
```

## Run locally

```bash
python -m http.server 8036
# open http://localhost:8036
```

## Important

ShiftRest gives **general, educational guidance** based on public shift-work sleep advice. It is **not medical advice**. If you have persistent sleep problems or suspect Shift Work Disorder, talk to a clinician.

## License

MIT — see [LICENSE](LICENSE).
