import re

sql_path = r"B:\himanshu uncle\Rahul\backup\New Project 20260730 2009.sql"

tables = set()
with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        m = re.search(r'CREATE TABLE `?(\w+)`?', line, re.IGNORECASE)
        if m:
            tables.add(m.group(1))

print("Tables in SQL Dump:")
for t in sorted(tables):
    print(f" - {t}")
