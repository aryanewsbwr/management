import csv
import json
import os
import sys

def import_customers_csv(csv_filepath):
    """
    Parses legacy CSV data and prepares Supabase/PostgreSQL formatted inserts
    for Customers, Subscriptions, Hawkers, and Dues.
    """
    if not os.path.exists(csv_filepath):
        print(f"Error: File '{csv_filepath}' not found.")
        return

    print(f"Reading legacy CSV: {csv_filepath}...")
    customers = []
    
    with open(csv_filepath, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.DictReader(f)
        for row in reader:
            customers.append(row)
            
    print(f"Successfully loaded {len(customers)} record(s) from CSV!")
    return customers

if __name__ == "__main__":
    if len(sys.argv) > 1:
        import_customers_csv(sys.argv[1])
    else:
        print("Usage: python import_old_data.py <path_to_csv_file>")
