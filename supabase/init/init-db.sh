#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

CONTAINER_NAME="supabase-db"
TEMP_DIR="/tmp/seed"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LOCAL_DATA_DIR="${SCRIPT_DIR}/data"

echo "Starting database seed..."

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}Error: Container ${CONTAINER_NAME} is not running${NC}"
    exit 1
fi

# Create temp directory in container
echo "Creating temp directory in container..."
docker exec ${CONTAINER_NAME} mkdir -p ${TEMP_DIR}

# Copy all SQL files to container
echo "Copying SQL files to container..."
for file in ${LOCAL_DATA_DIR}/*.sql; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "  - Copying ${filename}..."
        docker cp "$file" ${CONTAINER_NAME}:${TEMP_DIR}/${filename}
    fi
done

# Execute SQL files in order
echo "Executing SQL files..."
for file in ${LOCAL_DATA_DIR}/*.sql; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo -e "${GREEN}Executing ${filename}...${NC}"
        docker exec -i ${CONTAINER_NAME} psql -U postgres -d postgres -f ${TEMP_DIR}/${filename}
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ ${filename} completed successfully${NC}"
        else
            echo -e "${RED}✗ ${filename} failed${NC}"
            exit 1
        fi
    fi
done

# Create annotation storage bucket
echo -e "${GREEN}Creating storage bucket 'annotations'...${NC}"
docker exec -i ${CONTAINER_NAME} psql -U postgres -d postgres <<EOF
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('annotations', 'annotations', false, NULL, NULL)
ON CONFLICT (id) DO NOTHING;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Storage bucket 'annotations' created successfully${NC}"
else
    echo -e "${RED}✗ Storage bucket creation failed${NC}"
    exit 1
fi

# Cleanup
echo "Cleaning up..."
docker exec ${CONTAINER_NAME} rm -rf ${TEMP_DIR}

echo -e "${GREEN}Database seed completed successfully!${NC}"