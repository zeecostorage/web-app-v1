#!/bin/bash

# Define the directory and input/output files
db_dir="./db"
csv_file="$db_dir/sorted_age_ranges.csv"
json_file="$db_dir/age_ranges.json"

# Check if the CSV file exists, if not search in the current directory
if [[ ! -f "$csv_file" ]]; then
    echo "CSV file not found in $db_dir. Searching in the current directory..."
    csv_file="./sorted_age_ranges.csv"
    
    if [[ ! -f "$csv_file" ]]; then
        echo "CSV file not found in the current directory. Exiting."
        exit 1
    fi
    # Set the JSON file path to the same directory as the CSV file
    json_file="$(dirname "$csv_file")/age_ranges.json"
fi

# Convert CSV to JSON
{
    echo "["
    # Read CSV, skipping the header
    tail -n +2 "$csv_file" | while IFS=, read -r range count; do
        # Check if this is the last line to avoid adding a comma
        if [[ "$range" == "$(tail -n 1 "$csv_file" | cut -d, -f1)" ]]; then
            echo "  {"
            echo "    \"age_range\": \"$range\","
            echo "    \"count\": $count"
            echo "  }"
        else
            echo "  {"
            echo "    \"age_range\": \"$range\","
            echo "    \"count\": $count"
            echo "  },"
        fi
    done
    echo "]"
} > "$json_file"

# Check if the JSON file was created successfully
if [[ $? -eq 0 ]]; then
    echo "Age ranges converted to JSON and saved to $json_file."
else
    echo "Failed to save JSON to $json_file."
fi

