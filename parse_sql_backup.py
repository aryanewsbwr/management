import re
import json

sql_path = r"B:\himanshu uncle\Rahul\backup\New Project 20260730 2009.sql"

def parse_sql_dump():
    print("Reading SQL Dump...")
    with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Extract tables insert statements
    inserts = re.findall(r'INSERT INTO `?(\w+)`?\s+VALUES\s*([^;]+);', content, re.IGNORECASE)
    
    table_data = {}
    for table_name, values in inserts:
        if table_name not in table_data:
            table_data[table_name] = []
        table_data[table_name].append(values[:500]) # Sample

    print("Tables found in SQL dump:")
    for t in table_data.keys():
        print(f" - {t}")

if __name__ == '__main__':
    parse_sql_dump()
