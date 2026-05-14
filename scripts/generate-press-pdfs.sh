#!/usr/bin/env bash
# Generate static press kit PDFs via headless Chrome.
#
# Usage:
#   1) In one terminal:  pnpm dev          # starts http://localhost:3000
#   2) In another:       bash scripts/generate-press-pdfs.sh
#
# Output: public/press-kits/<slug>-<lang>.pdf  (+ press-kit-<lang>.pdf)
# Re-run whenever bio, discography, or label copy changes.

set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE="${BASE_URL:-http://localhost:3000}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/press-kits"
mkdir -p "$OUT"

if [ ! -x "$CHROME" ]; then
  echo "Chrome not found at $CHROME — install Google Chrome or edit the path." >&2
  exit 1
fi

if ! curl -fs -o /dev/null "$BASE/es"; then
  echo "Dev server not reachable at $BASE — run 'pnpm dev' first." >&2
  exit 1
fi

ARTISTS=(newen-afrobeat claudio-solis ecamhi con-fusion klaus-brantmayer andres-abrigo)
LANGS=(es en)

gen() {
  local url="$1" out="$2"
  "$CHROME" --headless=new --no-pdf-header-footer --print-to-pdf="$out" \
    --window-size=1200,1600 \
    --virtual-time-budget=20000 --hide-scrollbars --disable-gpu "$url" 2>/dev/null
  printf "  %-40s %7d bytes\n" "$(basename "$out")" "$(stat -f%z "$out")"
}

echo "Generating individual press kits..."
for lang in "${LANGS[@]}"; do
  for slug in "${ARTISTS[@]}"; do
    gen "$BASE/press/$lang/$slug" "$OUT/$slug-$lang.pdf"
  done
done

echo "Generating main press kits..."
for lang in "${LANGS[@]}"; do
  gen "$BASE/$lang/press-kit" "$OUT/press-kit-$lang.pdf"
done

echo
du -sh "$OUT"
