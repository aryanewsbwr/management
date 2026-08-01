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
customer_subs_raw = read_csv("5.2cust info.csv")
rates_raw = read_csv("6.1 rate.csv")
holidays_raw = read_csv("7holiday.csv")
bills_raw = read_csv("14.1 bill.csv")
receipts_raw = read_csv("13 payment recipt.csv")

# Process Publishers
publishers = []
for p in publishers_raw:
    pub_name = p.get("name") or p.get("Name") or "Publisher"
    if pub_name.strip():
        publishers.append({
            "publisher_id": int(p.get("Publish_id", 0) or 0),
            "name": pub_name,
            "address": p.get("address") or p.get("Address", ""),
            "city": p.get("city") or p.get("City", ""),
            "state": p.get("state") or p.get("State", ""),
            "pincode": p.get("pincode") or p.get("Pincode", ""),
            "phone": p.get("phone") or p.get("Phone", ""),
            "mobile": p.get("mobile") or p.get("Mobile", ""),
            "email": p.get("email") or p.get("Email", ""),
            "website": p.get("website") or p.get("Website", ""),
            "category": p.get("category") or p.get("Category", "Newspaper"),
            "type": p.get("type") or p.get("Type", "Publisher")
        })
pub_dict = {p["publisher_id"]: p["name"] for p in publishers}

# Process Publications
publications = []
for p in publications_raw:
    pubname = p.get("Public_name") or p.get("public_name") or "Publication"
    if pubname.strip():
        raw_type = p.get("TypeP", "Daily")
        type_p = "Daily"
        if "weekly" in raw_type.lower(): type_p = "Weekly"
        elif "monthly" in raw_type.lower(): type_p = "Monthly"
        elif "mag" in raw_type.lower(): type_p = "Magazine"
        pub_id = int(p.get("Publish_id", 1) or 1)
        publications.append({
            "publication_id": int(p.get("Publica_id", 0) or 0),
            "public_name": pubname,
            "pub_name_hindi": p.get("Pub_name_hindi") or p.get("pub_name_hindi", ""),
            "abrevation": p.get("Abrevation") or p.get("abrevation", ""),
            "publisher_id": pub_id,
            "publisher_name": pub_dict.get(pub_id, "Unknown Publisher"),
            "type_p": type_p,
            "rate": float(p.get("Rate", 5.0) or 5.0),
            "duration": p.get("Duration", "Monthly"),
            "publishing_day": p.get("Publishing_day", "Daily"),
            "circulation": p.get("Circulation", "Morning"),
            "is_active": True
        })
pub_name_dict = {p["publication_id"]: p["public_name"] for p in publications}

# Process Regions
regions = []
for r in regions_raw:
    regname = r.get("Region_name") or r.get("region_name") or "Region"
    if regname.strip():
        regions.append({
            "region_id": int(r.get("Region_id", 0) or 0),
            "region_name": regname,
            "name_hindi": r.get("Name_Hindi") or r.get("name_hindi", ""),
            "zone": r.get("Zone") or r.get("zone", "Zone 1")
        })
region_dict = {r["region_id"]: r["region_name"] for r in regions}

# Process Hawkers
hawkers = []
seen_hawker = set()
for h in hawkers_raw:
    hid = int(h.get("Hawker_id", 0) or 0)
    hname = h.get("Name") or h.get("name") or f"Hawker {hid}"
    if hid not in seen_hawker and hid > 0 and hname.strip():
        seen_hawker.add(hid)
        reg_id = int(h.get("Region_id", 1) or 1)
        hawkers.append({
            "hawker_id": hid,
            "name": hname,
            "address": h.get("Address") or h.get("address", ""),
            "city": h.get("City") or h.get("city", ""),
            "phone": h.get("Phone") or h.get("phone", ""),
            "mobile": h.get("Mobile") or h.get("mobile", ""),
            "assigned_regions": [reg_id],
            "region_name": region_dict.get(reg_id, "Central")
        })
hawker_name_dict = {h["hawker_id"]: h["name"] for h in hawkers}

# Process Customers (Limit to 500 for UI perf during this phase, 24k is huge for JSON parsing)
customers = []
seen_cust = set()
for c in customers_raw[:500]:
    cid = int(c.get("Customer_id", 0) or 0)
    cname = c.get("Name_Eng") or c.get("name_eng") or "Customer"
    if cid > 0 and cid not in seen_cust and cname.strip():
        seen_cust.add(cid)
        reg_id = int(c.get("Region_id", 1) or 1)
        due = float(c.get("Due_Amt", 0) or 0)
        customers.append({
            "customer_id": cid,
            "name_eng": cname,
            "name_hindi": c.get("Name_Hindi") or c.get("name_hindi", ""),
            "cust_type": c.get("Cust_Type", "Regular"),
            "add1": c.get("Add1", ""),
            "add2": c.get("Add2", ""),
            "hindi_add": c.get("Hindi_Add", ""),
            "phone": c.get("Phone", ""),
            "security_deposit": float(c.get("Security_Deposit", 0) or 0),
            "priority": int(c.get("Priority", 1) or 1),
            "due_amount": due,
            "c_bal": float(c.get("C_Bal", 0) or 0),
            "region_id": reg_id,
            "region_name": region_dict.get(reg_id, "City Zone"),
            "paid_status": "Paid" if due <= 0 else "Unpaid",
            "govt_supply": str(c.get("Govt_Supply", "")).lower() == "true",
            "is_sub_agent": str(c.get("Is_Sub_Agent", "")).lower() == "true",
            "susha_05": True,
            "is_self": True
        })
cust_name_dict = {c["customer_id"]: c["name_eng"] for c in customers}

# Process Customer Subscriptions (only for the 500 imported customers)
customer_subs = []
sno = 1
for sub in customer_subs_raw:
    cid = int(sub.get("Customer_id", 0) or 0)
    if cid in seen_cust:
        pid = int(sub.get("Publica_id", 0) or 0)
        hid = int(sub.get("Hawker_id", 0) or 0)
        
        # Parse from_day like "1-7" or "2-6"
        from_day_str = sub.get("From_Day", "1-7")
        delivery_days = [1,2,3,4,5,6,7]
        if from_day_str and "-" in from_day_str:
            try:
                start, end = map(int, from_day_str.split("-"))
                delivery_days = list(range(start, end+1))
            except:
                pass
                
        customer_subs.append({
            "sno": sno,
            "customer_id": cid,
            "publication_id": pid,
            "publication_name": pub_name_dict.get(pid, f"Pub {pid}"),
            "hawker_id": hid,
            "hawker_name": hawker_name_dict.get(hid, "Hawker"),
            "qty": int(sub.get("Qty", 1) or 1),
            "circulation": sub.get("Circulation", "Morning"),
            "delivery_days": delivery_days,
            "s_date": sub.get("S_Date", "2026-01-01"),
            "discount_percent": 0,
            "discount": 0,
            "delivery_charge": float(sub.get("Dely", 0) or 0),
            "hw_sa": "Hawker"
        })
        sno += 1

# Process Rates
rates = []
for idx, r in enumerate(rates_raw[:200]):
    rates.append({
        "rate_id": idx + 1,
        "publication_id": int(r.get("Publica_id", 0) or 0),
        "day_of_week": int(r.get("Dayofweek", 1) or 1),
        "rate": float(r.get("Rate", 0) or 0)
    })

# Process Holidays
holidays = []
for idx, h in enumerate(holidays_raw[:50]):
    holidays.append({
        "holiday_id": idx + 1,
        "oc_date": h.get("Oc_Date", "2026-01-01"),
        "occasion": h.get("Occasion", "Holiday"),
        "affected_publications": [int(h.get("Publica_id", 0) or 0)]
    })

# Process Receipts
receipts = []
for r in receipts_raw[:200]:
    cid = int(r.get("customer_id", 0) or 0)
    receipts.append({
        "receipt_id": int(r.get("Receipt_id", 0) or 0),
        "receipt_no": f'REC-{r.get("ManualRepNo", "")}',
        "customer_id": cid,
        "customer_name": cust_name_dict.get(cid, "Customer"),
        "collect_id": 1,
        "collector_name": "Vijay Kumar",
        "receipt_date": r.get("BillDate", "2026-01-01"),
        "bill_amount": float(r.get("BillAmt", 0) or 0),
        "manual_rcp_amt": float(r.get("MalRecpAmt", 0) or 0),
        "receipt_amount": float(r.get("RAmt", 0) or 0),
        "less_amount": float(r.get("LessAmt", 0) or 0),
        "balance_amount": float(r.get("Balance", 0) or 0),
        "manual_rcp_no": r.get("ManualRepNo", ""),
        "manual_rcp_date": r.get("MalRecpDt", "2026-01-01"),
        "payment_mode": r.get("Cash_Chq", "Cash"),
        "remarks": r.get("Narr", "")
    })

# Process Bills (Group by Bill_id)
bills_dict = {}
for b in bills_raw:
    cid = int(b.get("Customer_id", 0) or 0)
    if cid in seen_cust:
        bid = int(b.get("Bill_id", 0) or 0)
        if bid not in bills_dict:
            bills_dict[bid] = {
                "bill_id": bid,
                "customer_id": cid,
                "customer_name": cust_name_dict.get(cid, "Customer"),
                "name_hindi": "",
                "bill_month": b.get("Month", "January"),
                "bill_year": int(b.get("year", 2026) or 2026),
                "paper_amount": 0,
                "delivery_amount": 0,
                "discount_amount": 0,
                "previous_due": 0,
                "total_amount": 0,
                "net_payable": 0,
                "status": "Unpaid",
                "generated_date": "2026-04-01",
                "total_copies": 0
            }
        
        amt = float(b.get("TotalAmt", 0) or 0)
        bills_dict[bid]["paper_amount"] += amt
        bills_dict[bid]["total_amount"] += amt
        bills_dict[bid]["net_payable"] += amt
        bills_dict[bid]["total_copies"] += int(b.get("Qty", 1) or 1)

bills = list(bills_dict.values())[:300]


ts_content = f"""import {{ Publisher, Publication, Region, Hawker, Customer, CustomerDetail, PublicationRate, Holiday, Bill, Receipt, CounterSale, Purchase, Collector, ReceiptIssue, PublicationSup }} from './types';

export const mockPublishers: Publisher[] = {json.dumps(publishers, indent=2)};
export const mockPublications: Publication[] = {json.dumps(publications, indent=2)};
export const mockRegions: Region[] = {json.dumps(regions, indent=2)};
export const mockHawkers: Hawker[] = {json.dumps(hawkers, indent=2)};
export const mockCustomers: Customer[] = {json.dumps(customers, indent=2)};
export const mockCustomerDetails: CustomerDetail[] = {json.dumps(customer_subs, indent=2)};
export const mockPublicationRates: PublicationRate[] = {json.dumps(rates, indent=2)};
export const mockHolidays: Holiday[] = {json.dumps(holidays, indent=2)};
export const mockReceipts: Receipt[] = {json.dumps(receipts, indent=2)};
export const mockBills: Bill[] = {json.dumps(bills, indent=2)};

export const mockCounterSales: CounterSale[] = [];
export const mockPurchases: Purchase[] = [];
export const mockCollectors: Collector[] = [
  {{ collect_id: 1, name: 'Vijay Kumar', address: 'Central Zone Office', phone: '9826012345' }}
];
export const mockReceiptIssues: ReceiptIssue[] = [];
export const mockPublicationSups: PublicationSup[] = [];
"""

with open("src/lib/mockData.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("SUCCESS: mockData.ts re-seeded with deeply linked Customer Subs, Bills, and Receipts.")
