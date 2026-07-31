import csv
import json

base_dir = r"B:\himanshu uncle\Rahul"

def read_csv(filename):
    filepath = f"{base_dir}\\{filename}"
    rows = []
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            reader = csv.DictReader(f)
            for r in reader:
                rows.append(r)
    except Exception as e:
        print(f"Error reading {filename}: {e}")
    return rows

print("Loading CSV files...")
publishers_raw = read_csv("1publisher.csv")
publications_raw = read_csv("2publication.csv")
regions_raw = read_csv("3region.csv")
hawkers_raw = read_csv("4hawkeer.csv")
customers_raw = read_csv("5.1custinfo.csv")
cust_details_raw = read_csv("5.2cust info.csv")
payments_raw = read_csv("13 payment recipt.csv")
bills_raw = read_csv("14.1 bill.csv")

print(f"Loaded:")
print(f" - Publishers: {len(publishers_raw)}")
print(f" - Publications: {len(publications_raw)}")
print(f" - Regions: {len(regions_raw)}")
print(f" - Hawkers: {len(hawkers_raw)}")
print(f" - Customers: {len(customers_raw)}")
print(f" - Customer Subscriptions: {len(cust_details_raw)}")
print(f" - Payment Receipts: {len(payments_raw)}")
print(f" - Bills: {len(bills_raw)}")
