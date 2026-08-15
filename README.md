# The Cheapest Thing on the Internet

A seven-screen, scroll-driven web essay about what generative AI did to the web:
it made pages nearly free to produce, and in doing so moved the real cost from
*making* to *being found* — just as being found started being absorbed by AI
systems that answer on the page's behalf.

Built as the Assignment 3 artifact for NETS2000 Web Media (Curtin University).
The page is deliberately reflexive: it is a website, built by an AI coding
agent, about AI-built websites that nobody finds. Its own metadata, licence and
indexing status are displayed on the final screen as part of the argument.

**Live:** https://miint-sunny.github.io/the-cheapest-thing/

## Running it locally

There is no build step, no framework and no dependency to install. Either:

- open `index.html` directly in a browser, or
- serve the repo root, e.g. `python3 -m http.server` and visit
  `http://localhost:8000/`.

Everything is plain HTML, CSS and JavaScript. All "AI generation" effects are
pre-choreographed animation; the page makes no network requests beyond its own
files. All user-facing text (English and Chinese) lives in
`assets/js/copy.js`.

## About the commit history

The commit history of this repository is intentionally part of the work. The
page argues that AI collapsed the cost of making a website; the log of how this
website was made — by an AI coding agent (Claude Code), from a written
specification, in ordered steps — is the evidence, and screen 5 of the page
cites it.

## Licence

The page and its text are released under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — see `LICENSE`.

Fonts: [Space Grotesk](https://github.com/floriankarsten/space-grotesk) and
[JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), both under the
SIL Open Font License 1.1, self-hosted in `assets/fonts/` with their licence
texts alongside.
