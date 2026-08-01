import re

filepath = r"B:\AI_Projects\aryan-news-agency\src\lib\mockData.ts"

with open(filepath, "r", encoding="utf-8") as f:
    data = f.read()

# Replace amount: with amt: in mockCounterSales
start_idx_cs = data.find("export const mockCounterSales: CounterSale[] = [")
if start_idx_cs != -1:
    end_idx_cs = data.find("];", start_idx_cs) + 2
    cs_block = data[start_idx_cs:end_idx_cs]
    cs_block = cs_block.replace("amount:", "amt:")
    data = data[:start_idx_cs] + cs_block + data[end_idx_cs:]

with open(filepath, "w", encoding="utf-8") as f:
    f.write(data)

print("Fixed amount -> amt in mockCounterSales")
