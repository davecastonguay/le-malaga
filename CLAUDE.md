# Le Malaga – guest guide website

A one-page, mobile-first guide for home-exchange guests staying at Dave's lake house in Austin (near Magog, Eastern Townships, Québec). Hosted with GitHub Pages from `main`; every merge to `main` updates the live site.

## Workflow
- Never commit straight to `main`. Make changes on a branch and open a pull request; Dave merges from his phone.
- Keep the PR description short and in plain language (Dave is not a developer): what changed for guests, in one or two lines.
- Before opening the PR, check the page still loads (no JS errors) and each language shows the change.
- Checklist for every change: text in all 3 languages → rebuild PDFs → bump `VERSION` in `sw.js`.

## Structure
- `index.html` – the website: CSS at the top, markup, then the page script.
- `content.js` – **all guest-facing text**, in the `T` object: `T.fr`, `T.en`, `T.es`. Shared by the website and the printable guide.
  - Every change to text must be made in **every** language. Keys must match across languages.
  - `T.<lang>.cards` – the how-to cards (door, fire, stove, patio, win, heat, vinyl). Each card has `t` (title), `s` (subtitle), `blocks` (steps), optional `tip` and `warn` (highlighted notes), `caps` (photo captions) and demo data.
  - `tour` – photo tour: `[file-stem, title, caption]`, image at `img/<file-stem>.jpg`.
  - `acts` / `food` – "Around Magog": `[tag, name, description, Google Maps search query]`.
  - `leave` – the "before you leave" checklist: `[id, text]`. Keep the ids stable (they remember ticked boxes).
  - `urg` – emergency tiles: `[title, text, link or "", highlighted 0/1]`.
  - `pr` – labels used only in the printable guide.
  - `lakeFacts` / `lakeCut` – lake numbers (source: 2025 "Portrait du lac Malaga") and labels for the `lakeCut()` cross-section diagram in index.html.
- `IMG` in the script maps each card to its photos; `VID` adds optional how-to videos (a list of `[mp4, poster]`); each needs a matching entry in the card's `vids` in content.js: `{h: heading, cap: [[seconds, caption], ...]}`. Videos have no sound; the timed captions replace the voice.
- `img/` – photos (max ~800px, JPEG quality ~72) and short silent MP4 clips (H.264, ~960px wide, no audio).
- `print.html?lang=fr|en|es` – printable guide (US Letter) built from `content.js`. `qr.html` – sheet of 10 QR stickers.
- `print/` – the PDFs linked from the site. **Rebuild them after any text change:** `python3 tools/build_print.py` (needs Playwright + Chromium), then commit them.
- `img/qr/` – QR codes pointing to `https://davecastonguay.github.io/le-malaga/#<card>`. Rebuild with `tools/make_qr.sh` (needs pdflatex + pdftocairo) only if the site address changes.
- Page order: welcome → photo tour → `#maison` (cards) → `#savoir` → `#lac` → `#dehors` → `#depart` (cleaning + checklist `#partir`) → `#magog` → `#urgences`. The sticky `nav` chips (in content.js) jump to these.
- Deep links: `#door`, `#fire`, `#stove`, `#patio`, `#win`, `#heat`, `#vinyl` open that card; `#partir`, `#urgences` scroll to the section; `?lang=en` forces a language.
- `sw.js` – offline support. **Bump `VERSION` on every change**, and add any new image to `ASSETS`.
- `manifest.webmanifest`, `img/icon-*.png` – lets guests add the guide to their home screen.
- `.nojekyll` – keeps GitHub Pages from processing the files.

## Content rules
- Tone: friendly, clear, short bullet points. Guests should not have to read a book.
- Only write facts Dave gave. Don't invent house details.
- Never put the Wi-Fi password, door codes, or the exact address in this public repo; those stay in the printed guide.
- Keep the design tokens in `:root` (light + dark). Don't add external images or iframes.
