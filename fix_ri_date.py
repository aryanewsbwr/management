import re

filepath = r"B:\AI_Projects\aryan-news-agency\src\lib\mockData.ts"

with open(filepath, "r", encoding="utf-8") as f:
    data = f.read()

# Fix mockReceiptIssues
start_idx_ri = data.find("export const mockReceiptIssues: ReceiptIssue[] = [")
if start_idx_ri != -1:
    end_idx_ri = data.find("];", start_idx_ri) + 2
    
    replace_ri = """export const mockReceiptIssues: ReceiptIssue[] = [
  { issue_id: 1, collect_id: 1, book_no: 'B-001', receipt_from: 1001, receipt_to: 1100, issue_date: '01/08/2026' },
  { issue_id: 2, collect_id: 1, book_no: 'B-002', receipt_from: 1101, receipt_to: 1200, issue_date: '05/08/2026' }
];"""
    data = data[:start_idx_ri] + replace_ri + data[end_idx_ri:]

with open(filepath, "w", encoding="utf-8") as f:
    f.write(data)

print("Fixed mockReceiptIssues type error (added issue_date).")
