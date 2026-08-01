import re
import json

filepath = r"B:\AI_Projects\aryan-news-agency\src\lib\mockData.ts"

with open(filepath, "r", encoding="utf-8") as f:
    data = f.read()

matches = re.findall(r'\"([a-zA-Z0-9_]+)\"\s*:\s*\"(Z[A-Za-z0-9][^\"]*)\"', data)
print("Found Z prefixes:")
for m in set(matches):
    print(m)
