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

publishers_raw = read_csv("1publisher.csv")
publications_raw = read_csv("2publication.csv")
regions_raw = read_csv("3region.csv")
hawkers_raw = read_csv("4hawkeer.csv")
customers_raw = read_csv("5.1custinfo.csv")

# Process Publishers
publishers = []
for p in publishers_raw[:30]:
    publishers.append({
        "publisher_id": int(p.get("Publish_id", 0) or 0),
        "name": p.get("Name", "Publisher"),
        "address": p.get("Address", ""),
        "city": p.get("City", ""),
        "state": p.get("State", ""),
        "pincode": p.get("Pincode", ""),
        "phone": p.get("Phone", ""),
        "mobile": p.get("Mobile", ""),
        "email": p.get("Email", ""),
        "website": p.get("Website", ""),
        "category": p.get("Category", "Newspaper"),
        "type": p.get("Type", "Publisher")
    })

# Process Publications
publications = []
for p in publications_raw[:50]:
    raw_type = p.get("TypeP", "Daily")
    type_p = "Daily"
    if "weekly" in raw_type.lower():
        type_p = "Weekly"
    elif "monthly" in raw_type.lower():
        type_p = "Monthly"
    elif "mag" in raw_type.lower():
        type_p = "Magazine"

    publications.append({
        "publication_id": int(p.get("Publica_id", 0) or 0),
        "public_name": p.get("Public_name", "Publication"),
        "pub_name_hindi": p.get("Pub_name_hindi", ""),
        "abrevation": p.get("Abrevation", ""),
        "publisher_id": int(p.get("Publish_id", 1) or 1),
        "publisher_name": "Publisher",
        "type_p": type_p,
        "rate": float(p.get("Rate", 5.0) or 5.0),
        "duration": p.get("Duration", "Monthly"),
        "publishing_day": p.get("Publishing_day", "Daily"),
        "circulation": p.get("Circulation", "Morning"),
        "is_active": True
    })

# Process Regions
regions = []
for r in regions_raw[:120]:
    regions.append({
        "region_id": int(r.get("Region_id", 0) or 0),
        "region_name": r.get("Region_name", "Region")
    })

# Process Hawkers
hawkers = []
seen_hawker = set()
for h in hawkers_raw:
    hid = int(h.get("Hawker_id", 0) or 0)
    if hid not in seen_hawker and hid > 0:
        seen_hawker.add(hid)
        hawkers.append({
            "hawker_id": hid,
            "name": h.get("Name", f"Hawker {hid}"),
            "address": h.get("Address", ""),
            "city": h.get("City", ""),
            "phone": h.get("Phone", ""),
            "mobile": h.get("Mobile", ""),
            "assigned_regions": [int(h.get("Region_id", 1) or 1)],
            "region_name": "Assigned Routes"
        })
    if len(hawkers) >= 30:
        break

# Process Customers
customers = []
for c in customers_raw[:50]:
    cid = int(c.get("Customer_id", 0) or 0)
    if cid > 0:
        customers.append({
            "customer_id": cid,
            "name_eng": c.get("Name_Eng", "Customer"),
            "name_hindi": c.get("Name_Hindi", ""),
            "cust_type": c.get("Cust_Type", "Regular"),
            "add1": c.get("Add1", ""),
            "add2": c.get("Add2", ""),
            "hindi_add": c.get("Hindi_Add", ""),
            "phone": c.get("Phone", ""),
            "security_deposit": float(c.get("Security_Deposit", 0) or 0),
            "priority": int(c.get("Priority", 1) or 1),
            "due_amount": float(c.get("Due_Amt", 0) or 0),
            "c_bal": float(c.get("C_Bal", 0) or 0),
            "region_id": int(c.get("Region_id", 1) or 1),
            "region_name": "Zone",
            "paid_status": "Paid" if float(c.get("Due_Amt", 0) or 0) <= 0 else "Unpaid",
            "govt_supply": c.get("Govt_Supply", "False").lower() == "true",
            "is_sub_agent": c.get("Is_Sub_Agent", "False").lower() == "true",
            "susha_05": True,
            "is_self": True
        })

ts_content = f"""import {{ Publisher, Publication, Region, Hawker, Customer, CustomerDetail, PublicationRate, Holiday, Bill, Receipt, CounterSale, Purchase, Collector, ReceiptIssue, PublicationSup }} from './types';

export const mockPublishers: Publisher[] = {json.dumps(publishers, indent=2)};

export const mockPublications: Publication[] = {json.dumps(publications, indent=2)};

export const mockRegions: Region[] = {json.dumps(regions, indent=2)};

export const mockHawkers: Hawker[] = {json.dumps(hawkers, indent=2)};

export const mockCustomers: Customer[] = {json.dumps(customers, indent=2)};

export const mockCustomerDetails: CustomerDetail[] = [
  {{ sno: 1, customer_id: 1, publication_id: 1, publication_name: 'Dainik Bhaskar', hawker_id: 1, hawker_name: 'Ramesh Kumar', qty: 1, circulation: 'Morning', delivery_days: [1,2,3,4,5,6,7], s_date: '2026-01-01', discount_percent: 0, discount: 0, delivery_charge: 30.00, hw_sa: 'Hawker' }},
  {{ sno: 2, customer_id: 2, publication_id: 2, publication_name: 'Dainik Jagran', hawker_id: 2, hawker_name: 'Suresh Sharma', qty: 1, circulation: 'Morning', delivery_days: [1,2,3,4,5,6,7], s_date: '2026-01-01', discount_percent: 0, discount: 0, delivery_charge: 30.00, hw_sa: 'Hawker' }}
];

export const mockPublicationRates: PublicationRate[] = [
  {{ rate_id: 1, publication_id: 1, day_of_week: 1, rate: 5.00 }},
  {{ rate_id: 2, publication_id: 1, day_of_week: 2, rate: 5.00 }},
  {{ rate_id: 3, publication_id: 1, day_of_week: 3, rate: 5.00 }},
  {{ rate_id: 4, publication_id: 1, day_of_week: 4, rate: 5.00 }},
  {{ rate_id: 5, publication_id: 1, day_of_week: 5, rate: 5.00 }},
  {{ rate_id: 6, publication_id: 1, day_of_week: 6, rate: 5.00 }},
  {{ rate_id: 7, publication_id: 1, day_of_week: 7, rate: 7.00 }}
];

export const mockHolidays: Holiday[] = [
  {{ holiday_id: 1, oc_date: '2026-08-15', occasion: 'Independence Day Press Holiday', affected_publications: [1, 2, 3] }}
];

export const mockBills: Bill[] = [
  {{ bill_id: 101, customer_id: 1, customer_name: 'Sharma Ji', name_hindi: 'शर्मा जी', bill_month: 'July', bill_year: 2026, paper_amount: 320.00, delivery_amount: 30.00, discount_amount: 0.00, previous_due: 110.00, total_amount: 460.00, net_payable: 460.00, status: 'Unpaid', generated_date: '2026-07-31', total_copies: 31 }}
];

export const mockReceipts: Receipt[] = [
  {{ receipt_id: 101, receipt_no: 'REC-1187540', customer_id: 1, customer_name: 'Sharma Ji', collect_id: 1, collector_name: 'Vijay Kumar', receipt_date: '2026-07-30', bill_amount: 460.00, manual_rcp_amt: 0.00, receipt_amount: 460.00, less_amount: 0.00, balance_amount: 0.00, manual_rcp_no: '1187540', manual_rcp_date: '2026-07-30', payment_mode: 'Cash', remarks: 'Monthly Subscription Paid' }}
];

export const mockCounterSales: CounterSale[] = [
  {{ sale_id: 1, publication_id: 1, publication_name: 'Dainik Bhaskar', qty: 2, rate: 5.00, amt: 10.00, sale_date: '2026-07-31', period: '2026-2027', customer_name: 'Walk-in Retail', narration: 'OTC Cash Sale' }}
];

export const mockPurchases: Purchase[] = [
  {{ purchase_id: 1, publisher_id: 1, publisher_name: 'Dainik Bhaskar Press', bill_no: 'INV-DB-9001', bill_date: '2026-07-28', r_date: '2026-07-29', total: 420.00, add_less: 0.00, net_amt: 420.00, items: [{{ publication_id: 1, publication_name: 'Dainik Bhaskar', qty: 100, rate: 4.20, amt: 420.00 }}] }}
];

export const mockCollectors: Collector[] = [
  {{ collect_id: 1, name: 'Vijay Kumar', address: 'Central Zone Office', phone: '9826012345' }}
];

export const mockReceiptIssues: ReceiptIssue[] = [
  {{ issue_id: 1, collect_id: 1, collector_name: 'Vijay Kumar', receipt_from: 1187500, receipt_to: 1187600, issue_date: '2026-07-01' }}
];

export const mockPublicationSups: PublicationSup[] = [
  {{ publica_id: 1, publication_name: 'Dainik Bhaskar', supname: 'Rasrang Weekend Supplement' }}
];
"""

with open(r"B:\AI_Projects\aryan-news-agency\src\lib\mockData.ts", "w", encoding="utf-8") as out:
    out.write(ts_content)

print("Updated mockData.ts with valid types!")
