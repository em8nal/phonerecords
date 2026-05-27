#!/usr/bin/env bash
# Submit all URLs from the sitemap to IndexNow (Bing + Yandex + Naver in one call).
# Run after a deploy that adds or significantly changes URLs.
#
# Usage:
#   bash scripts/indexnow-submit.sh               # submits every sitemap URL
#   bash scripts/indexnow-submit.sh <url> [...]   # submits only the URLs passed

set -euo pipefail

HOST="phonerecords.cl"
KEY="f956326605114ec88d34bb4a617bb9f6"
KEY_LOCATION="https://$HOST/$KEY.txt"
SITEMAP="https://$HOST/sitemap.xml"

# Build the URL list. Avoid bash 4 array features so we work on macOS bash 3.2.
TMP_URLS=$(mktemp)
trap 'rm -f "$TMP_URLS" /tmp/indexnow-resp.txt /tmp/indexnow-payload.json' EXIT

if [ "$#" -gt 0 ]; then
  for u in "$@"; do printf '%s\n' "$u" >> "$TMP_URLS"; done
else
  curl -sL "$SITEMAP" | grep -oE '<loc>[^<]+</loc>' | sed 's|<loc>||;s|</loc>||' > "$TMP_URLS"
fi

total=$(wc -l < "$TMP_URLS" | tr -d ' ')
if [ "$total" -eq 0 ]; then
  echo "No URLs to submit." >&2
  exit 1
fi

echo "Submitting $total URLs to IndexNow…"

batch_size=500
batch_num=0
offset=0
while [ "$offset" -lt "$total" ]; do
  batch_num=$((batch_num + 1))
  end=$((offset + batch_size))
  if [ "$end" -gt "$total" ]; then end=$total; fi
  count=$((end - offset))

  # Build JSON list for this batch.
  json_list=$(sed -n "$((offset + 1)),${end}p" "$TMP_URLS" | awk '{printf "\"%s\",", $0}' | sed 's/,$//')

  cat > /tmp/indexnow-payload.json <<JSON
{"host":"$HOST","key":"$KEY","keyLocation":"$KEY_LOCATION","urlList":[$json_list]}
JSON

  http_code=$(curl -s -o /tmp/indexnow-resp.txt -w "%{http_code}" \
    -X POST "https://api.indexnow.org/indexnow" \
    -H "Content-Type: application/json; charset=utf-8" \
    --data-binary @/tmp/indexnow-payload.json)

  echo "  Batch $batch_num: $count URLs → HTTP $http_code"
  if [ "$http_code" != "200" ] && [ "$http_code" != "202" ]; then
    echo "    Response: $(cat /tmp/indexnow-resp.txt)"
  fi

  offset=$end
done

echo "Done."
