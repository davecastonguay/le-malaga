#!/bin/sh
# Builds img/qr/<name>.svg QR codes with LaTeX (qrcode package). Run from the repo root.
set -e
BASE="https://davecastonguay.github.io/le-malaga/"
TMP=$(mktemp -d)
for pair in "site:" "door:#door" "fire:#fire" "stove:#stove" "patio:#patio" "win:#win" "heat:#heat" "vinyl:#vinyl" "partir:#partir" "urgences:#urgences"; do
  name=${pair%%:*}; frag=${pair#*:}
  url="$BASE$frag"
  esc=$(printf '%s' "$url" | sed 's/#/\\#/g')
  printf '\\documentclass[border=0pt]{standalone}\\usepackage[forget]{qrcode}\\begin{document}\\qrcode[height=4cm,level=M]{%s}\\end{document}\n' "$esc" > "$TMP/$name.tex"
  (cd "$TMP" && pdflatex -interaction=batchmode "$name.tex" >/dev/null)
  pdftocairo -svg "$TMP/$name.pdf" "img/qr/$name.svg"
done
rm -rf "$TMP"
echo "QR codes written to img/qr/"
