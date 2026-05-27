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

# Build the URL list.
if [ "$#" -gt 0 ]; then
  URLS=("$@")
else
  mapfile -t URLS < <(curl -sL "$SITEMAP" | grep -oE '<loc>[^<]+</loc>' | sed 's/<loc>//;s/<\/loc>//')
fi

if [ "${#URLS[@]}" -eq 0 ]; then
  echo "No URLs to submit." >&2
  exit 1
fi

echo "Submitting ${#URLS[@]} URLs to IndexNow…"

# IndexNow accepts up to 10,000 URLs per call. Batch in 500 to stay safe.
batch_size=500
i=0
while [ "$i" -lt "${#URLS[@]}" ]; do
  end=$((i + batch_size))
  if [ "$end" -gt "${#URLS[@]}" ]; then end=${#URLS[@]}; fi

  url_array=$(printf '"%s",' "${URLS[@]:i:batch_size}" | sed 's/,$//')
  payload=$(cat <<JSON
{
  "host": "$HOST",
  "key": "$KEY",
  "keyLocation": "$KEY_LOCATION",
  "urlList": [$url_array]
}
JSON
)

  echo "  Batch $((i / batch_size + 1)): $((end - i)) URLs"
  http_code=$(curl -s -o /tmp/indexnow-resp.txt -w "%{http_code}" \
    -X POST "https://api.indexnow.org/indexnow" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d "$payload")
  echo "    HTTP $http_code"
  if [ "$http_code" != "200" ] && [ "$http_code" != "202" ]; then
    echo "    Response: $(cat /tmp/indexnow-resp.txt)"
  fi

  i=$end
done

echo "Done."
