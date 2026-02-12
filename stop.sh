#!/usr/bin/env bash
set -euo pipefail

CONTAINERS=$(docker ps -q \
  --filter "name=^supabase" \
  --filter "name=^liiive" \
  --filter "name=supabase-realtime")

if [ -z "$CONTAINERS" ]; then
  echo "No liiive-related containers are currently running."
  exit 0
fi

echo "Stopping the following containers:"
docker ps \
  --filter "name=^supabase" \
  --filter "name=^liiive" \
  --filter "name=supabase-realtime" \
  --format " - {{.Names}}"

docker stop $CONTAINERS >/dev/null

echo "Done."
