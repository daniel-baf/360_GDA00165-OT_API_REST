#!/bin/bash

# Setup Script for SQL Server
# -------------------------------------------
# Usage:
#   bash setup.sh <sql_password> [sql_user]
# Example:
#   bash setup.sh mypassword         # Uses 'sa' as the default user
#   bash setup.sh mypassword otheruser # Uses 'otheruser' as the user
# -------------------------------------------
# Ensure 'sqlcmd' is installed and configured correctly before running this script.

# Functions to execute scripts
run_main_script() {
    local sql_user=${2:-sa}  # Use 'sa' if the second parameter is not provided
    local sql_password=$1

    echo "Running GDA00165_GT_DANIEL_BAUTISTA.sql..."
    sqlcmd -S localhost -U "$sql_user" -P "$sql_password" -i GDA00165_GT_DANIEL_BAUTISTA.sql
    if [ $? -eq 0 ]; then
        echo "GDA00165_GT_DANIEL_BAUTISTA.sql COMPLETE"
    else
        echo "Failed to execute GDA00165_GT_DANIEL_BAUTISTA.sql"
        exit 1
    fi
}

# Check for at least 1 argument (password)
if [ -z "$1" ]; then
    echo "Usage: bash setup.sh <sql_password> [sql_user]"
    exit 1
fi

# Run the main script with provided arguments
run_main_script "$1" "$2"
