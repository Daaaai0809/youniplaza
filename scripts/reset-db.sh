#!/bin/bash

# Reset the database

THIS_FILE_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "${THIS_FILE_DIR}/.." && pwd)"
SERVER_DIR="${PROJECT_DIR}/api"

cd "${SERVER_DIR}"

pwd

TABLE_NAMES=("users" "schools" "restaurants" "comments" "tags" "tag_to_restaurants")

# Drop the database
for table in "${TABLE_NAMES[@]}"; do
  wrangler d1 execute unimeshi-db --local --command "DROP TABLE ${table};"
done

# Create the database
if [ ! -d "./migrations/*" ]; then
  pnpm run generate
fi

pnpm run migrate:local