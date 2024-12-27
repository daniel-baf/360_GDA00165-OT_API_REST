#!/bin/bash

# Setup Script for SQL Server
# -------------------------------------------
# Usage:
#   bash setup.sh           --> Executes both GDA00165_GT_DANIEL_BAUTISTA.sql and USER_CONFIG.sql.
# -------------------------------------------
# Ensure 'sqlcmd' is installed and configured correctly before running this script.
# -p flag is used to prompt for password. Remove it if you want to hardcode the password.

# Functions to execute scripts
run_main_script() {
    echo "Running GDA00165_GT_DANIEL_BAUTISTA.sql..."
    sqlcmd -S localhost -U sa -p -i GDA00165_GT_DANIEL_BAUTISTA.sql
    echo "GDA00165_GT_DANIEL_BAUTISTA.sql COMPLETE"
}


run_main_script
