#!/bin/bash

# Define input and output files
input_file="./db/user.txt"  # Use full path
output_file="./db/user_cleanup.txt"

# Check if input file exists
if [[ -f $input_file ]]; then
    # Process the input file: exclude lines with "test", remove duplicates, and save to the output file
    tail -n +2 "$input_file" | grep -v "test" | awk -F, '{gsub(/ /, "", $3); print $2 "," $3}' | sort -u > "$output_file"
    
    echo "Entries with 'test' excluded, dates removed, and duplicates cleaned. Result saved to $output_file."
else
    echo "Input file does not exist."
    exit 1
fi

