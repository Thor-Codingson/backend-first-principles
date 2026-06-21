#!/usr/bin/env bash
set -euo pipefail

ES_URL="http://localhost:9200"
INDEX="books"

echo "1. Delete index if it exists (safe to re-run)"
curl -s -X DELETE "$ES_URL/$INDEX" > /dev/null || true

echo "2. Create index — refresh disabled, so visibility is deterministic"
curl -s -X PUT "$ES_URL/$INDEX" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0,
    "refresh_interval": "-1"
  },
  "mappings": {
    "properties": {
      "title":  { "type": "text" },
      "author": { "type": "text" },
      "created_at": { "type": "date" }
    }
  }
}'
echo -e "\n"

echo "3. Index one document"
curl -s -X POST "$ES_URL/$INDEX/_doc/1" -H 'Content-Type: application/json' -d'
{
  "title": "React: The Complete Guide",
  "author": "John Doe",
  "created_at": "2026-06-21"
}'
echo -e "\n"

echo "4. Search BEFORE refresh — must show value:0"
curl -s "$ES_URL/$INDEX/_search?q=react"
echo -e "\n"

echo "5. Manual refresh"
curl -s -X POST "$ES_URL/$INDEX/_refresh"
echo -e "\n"

echo "6. Search AFTER refresh — must show value:1"
curl -s "$ES_URL/$INDEX/_search?q=react"
echo -e "\n"