#!/usr/bin/env bash
set -e

export COMPOSE_PROJECT_NAME=supabase
export PROJECT_ROOT="$(pwd)"
export SUPABASE_ROOT="$(pwd)/supabase/docker"
export STUDIO_DOMAIN="localhost:8000"

docker compose \
  --env-file ./supabase/docker/.env \
  -f ./supabase/docker/docker-compose.yml \
  -f ./supabase/docker/docker-compose.s3.yml \
  -f docker-compose.dev.yml \
  up --build -d