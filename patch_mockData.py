import re

filepath = r"B:\AI_Projects\aryan-news-agency\src\lib\mockData.ts"

with open(filepath, "r", encoding="utf-8") as f:
    data = f.read()

# Make sure we don't duplicate the earlier replacement, just fix the mockPurchases array.
# Let's search for "export const mockPurchases: Purchase[] =" up to "];"
start_str = "export const mockPurchases: Purchase[] = ["
end_str = "];"
start_idx = data.find(start_str)
if start_idx != -1:
    end_idx = data.find(end_str, start_idx) + len(end_str)
    
    replace_purchases = """export const mockPurchases: Purchase[] = [
  { purchase_id: 101, publisher_id: 1, bill_no: "B-1001", bill_date: "01/08/2026", r_date: "01/08/2026", total: 1700, add_less: 0, net_amt: 1700, items: [{ publication_id: 1, qty: 500, rate: 3.40, amt: 1700 }] },
  { purchase_id: 102, publisher_id: 2, bill_no: "B-1002", bill_date: "01/08/2026", r_date: "01/08/2026", total: 750, add_less: 0, net_amt: 750, items: [{ publication_id: 2, qty: 300, rate: 2.50, amt: 750 }] }
];"""
    data = data[:start_idx] + replace_purchases + data[end_idx:]

with open(filepath, "w", encoding="utf-8") as f:
    f.write(data)

print("Mock data patched: Fixed mockPurchases array to match Purchase interface.")
