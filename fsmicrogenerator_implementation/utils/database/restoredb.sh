#!/bin/bash

# Read parameters from environment variables
HOST=${HOST:-"127.0.0.1"} # Default to localhost if not set
PORT=${PORT:-"27017"}
RETRY_LIMIT=${RETRY_LIMIT:-3}
RETRY_INTERVAL=${RETRY_INTERVAL:-5}
LOG_FILE=${LOG_FILE:-"./mongo_wait.log"}
IMPORT_MARKER_FILE="dbimported.txt"
PREFIX=${PREFIX:-"Inventory"}
BASE_IMPORT_FOLDER=${BASE_IMPORT_FOLDER:-"./"} # Base folder containing subfolders with collections

# Initialize retry counter
RETRY_COUNT=0

# Clear or create the log file
> "$LOG_FILE"
echo "Starting MongoDB readiness check with authentication..." | tee -a "$LOG_FILE"
#set -x
# Wait for MongoDB to become available
until mongosh --host "$HOST" --port "$PORT"  --eval "db.stats()" >> "$LOG_FILE" 2>&1; do
    if [ "$RETRY_COUNT" -ge "$RETRY_LIMIT" ]; then
        echo "MongoDB did not become ready within the retry limit. Exiting." | tee -a "$LOG_FILE"
        exit 1
    fi
    echo "Attempt $((RETRY_COUNT + 1)): Waiting for MongoDB to be ready..." | tee -a "$LOG_FILE"
    sleep "$RETRY_INTERVAL"
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

echo "MongoDB is ready!" | tee -a "$LOG_FILE"

# Function to format database name
format_db_name() {
    local folder_name=$1
    local prefix=$2

    # Remove 'db_' prefix
    formatted_name=${folder_name#db_}

    # Capitalize first letter
    formatted_name="$(echo "${formatted_name:0:1}" | tr '[:lower:]' '[:upper:]')${formatted_name:1}"

    # Remove the last occurrence of 'Service'
    formatted_name=$(echo "$formatted_name" | sed 's/Service$//')

    # Add prefix and DB suffix
    echo "${formatted_name}${prefix}DB"
}

import_collections_from_folders() {
    # Browse each folder in the home directory
    for folder in "$BASE_IMPORT_FOLDER"/*; do
        [ -d "$folder" ] || continue

        folder_name=$(basename "$folder")
        db_name=$(format_db_name "$folder_name" "$PREFIX")

        echo "Processing database '$db_name' from folder '$folder'..." | tee -a "$LOG_FILE"

        # Check marker to ignore imports already made
        if [ -f "$folder/$IMPORT_MARKER_FILE" ]; then
            echo "Database '$db_name' already imported. Skipping." | tee -a "$LOG_FILE"
            continue
        fi

        bson_count=$(find "$folder" -maxdepth 1 -name '*.bson' | wc -l)
        json_count=$(find "$folder" -maxdepth 1 -name '*.json' | wc -l)

        if [ "$bson_count" -gt 0 ]; then
            echo "BSON files found. Using mongorestore on directory '$folder'..." | tee -a "$LOG_FILE"
            mongorestore --host "$HOST" --port "$PORT" --db "$db_name" "$folder" >> "$LOG_FILE" 2>&1

        elif [ "$json_count" -gt 0 ]; then
            echo "No BSON found. JSON files detected. Using mongoimport for '$db_name'..." | tee -a "$LOG_FILE"
            for file in "$folder"/*.json; do
                [ -f "$file" ] || continue
                collection_name=$(basename "$file" .json)
                echo "Importing collection '$collection_name' into database '$db_name'..." | tee -a "$LOG_FILE"

                mongoimport --host "$HOST" --port "$PORT" --db "$db_name" --collection "$collection_name" --file "$file" --jsonArray >> "$LOG_FILE" 2>&1
            done

        else
            echo "No BSON or JSON files found in '$folder'. Skipping '$db_name'." | tee -a "$LOG_FILE"
            continue
        fi

        # Mark folder as imported
        echo "Database '$db_name' import completed. Creating marker file." | tee -a "$LOG_FILE"
        touch "$folder/$IMPORT_MARKER_FILE"
    done
}


# Launch import
echo "Starting database import..." | tee -a "$LOG_FILE"
import_collections_from_folders
echo "Script completed successfully." | tee -a "$LOG_FILE"
exit 0