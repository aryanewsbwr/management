import re

filepath = r"B:\AI_Projects\aryan-news-agency\src\lib\mockData.ts"

with open(filepath, "r", encoding="utf-8") as f:
    data = f.read()

# Replace i_date: '...' with nothing in mockReceiptIssues
start_idx_ri = data.find("export const mockReceiptIssues: ReceiptIssue[] = [")
if start_idx_ri != -1:
    end_idx_ri = data.find("];", start_idx_ri) + 2
    ri_block = data[start_idx_ri:end_idx_ri]
    ri_block = re.sub(r",\s*i_date:\s*'[^']*'", "", ri_block)
    data = data[:start_idx_ri] + ri_block + data[end_idx_ri:]

with open(filepath, "w", encoding="utf-8") as f:
    f.write(data)

print("Fixed mockReceiptIssues type error.")
