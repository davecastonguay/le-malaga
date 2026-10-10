# Le Malaga – guest guide website

A one-page, mobile-first guide for home-exchange guests staying at Dave's lake house in Austin (near Magog, Eastern Townships, Québec). Hosted with GitHub Pages from `main`; every merge to `main` updates the live site.

## Workflow
- Never commit straight to `main`. Make changes on a branch and open a pull request; Dave merges from his phone.
- Keep the PR description short and in plain language (Dave is not a developer): what changed for guests, in one or two lines.
- Before opening the PR, check the page still loads (no JS errors) and each language shows the change.

## Structure
- `index.html` – the whole site: CSS at the top, markup, then one `<script>`.
- All guest-facing text lives in the `T` object in the script: `T.fr`, `T.en` (Spanish `T.es` is planned).
  - Every change to text must be made in **every** language. Keys must match across languages.
  - `T.<lang>.cards` – the how-to cards (door, fire, stove, patio, win, heat). Each card has `t` (title), `s` (subtitle), `blocks` (steps), optional `tip`, `caps` (photo captions) and demo data.
  - `tour` – photo tour: `[file-stem, title, caption]`, image at `img/<file-stem>.jpg`.
  - `acts` / `food` – "Around Magog": `[tag, name, description, Google Maps search query]`.
  - `leave` – the "before you leave" checklist.
- `IMG` in the script maps each card to its photos.
- `img/` – photos (max ~800px, JPEG quality ~72) and short silent MP4 clips (H.264, ~960px wide, no audio).
- `.nojekyll` – keeps GitHub Pages from processing the files.

## Content rules
- Tone: friendly, clear, short bullet points. Guests should not have to read a book.
- Only write facts Dave gave. Don't invent house details.
- Never put the Wi-Fi password, door codes, or the exact address in this public repo; those stay in the printed guide.
- Keep the design tokens in `:root` (light + dark). Don't add external images or iframes.
