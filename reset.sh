#!/usr/bin/env bash
set -euo pipefail

CONTAINERS=$(docker ps -a -q \
  --filter "name=^supabase" \
  --filter "name=^liiive" \
  --filter "name=supabase-realtime")

if [ -z "$CONTAINERS" ]; then
  echo "No liiive-related containers found."
  exit 0
fi

echo "The following containers will be stopped and removed:"
docker ps -a \
  --filter "name=^supabase" \
  --filter "name=^liiive" \
  --filter "name=supabase-realtime" \
  --format " - {{.Names}}"

read -p "Continue? [y/N] " -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

docker stop $CONTAINERS >/dev/null
docker rm $CONTAINERS >/dev/null

echo "Containers removed. Persistent data volumes were not deleted."
