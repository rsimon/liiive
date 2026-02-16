#!/usr/bin/env bash
set -e

export COMPOSE_PROJECT_NAME=supabase
export PROJECT_ROOT="$(pwd)"
export SUPABASE_ROOT="$(pwd)/supabase/docker"

docker compose \
  --env-file ./supabase/docker/.env \
  --env-file ./traefik/.env \
  -f ./supabase/docker/docker-compose.yml \
  -f ./supabase/docker/docker-compose.s3.yml \
  -f docker-compose.preview.yml \
  up --build -d