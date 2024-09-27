#!/bin/bash

# Define the directory
db_dir="./db"

# Define input and output files
input_file="$db_dir/user_cleanup.txt"
output_file="$db_dir/sorted_age_ranges.csv"

# Check if the input file exists
if [[ ! -f $input_file ]]; then
    echo "Input file not found in $db_dir. Exiting."
    exit 1
fi

# Initialize age ranges
declare -A age_ranges

# Define age ranges
ranges=("0-19" "20-39" "40-59" "60-79" "80-89")

# Initialize counts for each age range
for range in "${ranges[@]}"; do
    age_ranges["$range"]=0
done

# Process the input file
while IFS=, read -r name age; do
    age=$(echo "$age" | xargs)  # Trim whitespace
    if [[ -z $age ]]; then
        echo "Warning: Age is empty for entry '$name'. Skipping."
        continue
    fi
    if [[ $age =~ ^[0-9]+$ ]]; then
        if [[ $age -ge 0 && $age -le 19 ]]; then
            age_ranges["0-19"]=$((age_ranges["0-19"] + 1))
        elif [[ $age -ge 20 && $age -le 39 ]]; then
            age_ranges["20-39"]=$((age_ranges["20-39"] + 1))
        elif [[ $age -ge 40 && $age -le 59 ]]; then
            age_ranges["40-59"]=$((age_ranges["40-59"] + 1))
        elif [[ $age -ge 60 && $age -le 79 ]]; then
            age_ranges["60-79"]=$((age_ranges["60-79"] + 1))
        elif [[ $age -ge 80 && $age -le 89 ]]; then
            age_ranges["80-89"]=$((age_ranges["80-89"] + 1))
        fi
    else
        echo "Warning: Age '$age' is not a valid number for entry '$name'. Skipping."
    fi
done < "$input_file"

# Output the results
{
    echo "Age Range,Count"
    for range in "${ranges[@]}"; do
        echo "$range,${age_ranges["$range"]}"
    done
} > "$output_file"

echo "Sorted age ranges saved to $output_file."

####################################################################
# Covert to JSON




