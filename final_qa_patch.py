import re

filepath = r"B:\AI_Projects\aryan-news-agency\src\lib\mockData.ts"

with open(filepath, "r", encoding="utf-8") as f:
    data = f.read()

# 1. Global 'Z' Purge for all relevant string properties in the mock data
properties_to_clean = ["name", "region_name", "public_name", "pub_name", "publisher_name", "occasion", "publication_name", "name_eng", "name_hindi", "address"]

for prop in properties_to_clean:
    # Pattern looks for e.g. "name": "ZPintu" or "name_eng": "ZP K Rawanka ji"
    data = re.sub(rf'("{prop}"\s*:\s*")Z([a-zA-Z0-9][^"]*)"', r'\1\2"', data)

# 2. Inject Dummy Data for empty arrays
# mockCounterSales
start_idx_cs = data.find("export const mockCounterSales: CounterSale[] = [];")
if start_idx_cs != -1:
    replace_cs = """export const mockCounterSales: CounterSale[] = [
  { sale_id: 1, publication_id: 1, qty: 50, rate: 3.40, amount: 170, sale_date: '01/08/2026' },
  { sale_id: 2, publication_id: 2, qty: 25, rate: 2.50, amount: 62.5, sale_date: '01/08/2026' },
  { sale_id: 3, publication_id: 3, qty: 10, rate: 4.00, amount: 40, sale_date: '01/08/2026' }
];"""
    data = data.replace("export const mockCounterSales: CounterSale[] = [];", replace_cs)

# mockReceiptIssues
start_idx_ri = data.find("export const mockReceiptIssues: ReceiptIssue[] = [];")
if start_idx_ri != -1:
    replace_ri = """export const mockReceiptIssues: ReceiptIssue[] = [
  { issue_id: 1, collect_id: 1, book_no: 'B-001', receipt_from: 1001, receipt_to: 1100, i_date: '01/08/2026' },
  { issue_id: 2, collect_id: 1, book_no: 'B-002', receipt_from: 1101, receipt_to: 1200, i_date: '05/08/2026' }
];"""
    data = data.replace("export const mockReceiptIssues: ReceiptIssue[] = [];", replace_ri)

# mockPublicationSups
start_idx_ps = data.find("export const mockPublicationSups: PublicationSup[] = [];")
if start_idx_ps != -1:
    replace_ps = """export const mockPublicationSups: PublicationSup[] = [
  { sup_id: 1, publication_id: 1, supname: 'Sunday Magazine (रविवासरीय)' },
  { sup_id: 2, publication_id: 2, supname: 'Bal Bhaskar (बाल भास्कर)' },
  { sup_id: 3, publication_id: 3, supname: 'Madhurima (मधुरिमा)' }
];"""
    data = data.replace("export const mockPublicationSups: PublicationSup[] = [];", replace_ps)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(data)

print("Successfully purged Z prefixes and injected dummy data.")
