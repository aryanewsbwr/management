import re

filepath = r"B:\AI_Projects\aryan-news-agency\src\lib\mockData.ts"

with open(filepath, "r", encoding="utf-8") as f:
    data = f.read()

# Replace all occurrences where a JSON-like string value starts with 'Z' followed by an uppercase letter or number.
# e.g., "name": "ZPintu" -> "name": "Pintu"
# We'll explicitly check for properties like "name", "region_name", "public_name", "pub_name"
data = re.sub(r'("name"\s*:\s*")Z([A-Z0-9][^"]*)"', r'\1\2"', data)
data = re.sub(r'("region_name"\s*:\s*")Z([A-Z0-9][^"]*)"', r'\1\2"', data)
data = re.sub(r'("public_name"\s*:\s*")Z([A-Z0-9][^"]*)"', r'\1\2"', data)
data = re.sub(r'("pub_name"\s*:\s*")Z([A-Z0-9][^"]*)"', r'\1\2"', data)
data = re.sub(r'("publisher_name"\s*:\s*")Z([A-Z0-9][^"]*)"', r'\1\2"', data)
data = re.sub(r'("occasion"\s*:\s*")Z([A-Z0-9][^"]*)"', r'\1\2"', data)
data = re.sub(r'("publication_name"\s*:\s*")Z([A-Z0-9][^"]*)"', r'\1\2"', data)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(data)

print("Successfully replaced all remaining Z prefixes in mockData.ts")
