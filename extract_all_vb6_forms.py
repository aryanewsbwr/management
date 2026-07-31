import re
import sys

def decompile_exe_strings(exe_path):
    with open(exe_path, 'rb') as f:
        data = f.read()

    # Extract ASCII strings
    ascii_strings = re.findall(b'[\x20-\x7e]{4,}', data)
    
    # Extract UTF-16 strings
    utf16_strings = re.findall(b'(?:[\x20-\x7e]\x00){4,}', data)

    decoded = []
    for s in ascii_strings:
        try:
            decoded.append(s.decode('ascii'))
        except:
            pass

    for s in utf16_strings:
        try:
            decoded.append(s.decode('utf-16le'))
        except:
            pass

    # Filter forms, menus, SQL statements, and reports
    forms = [s for s in decoded if 'frm' in s.lower() or 'form' in s.lower() or 'report' in s.lower()]
    sqls = [s for s in decoded if 'select ' in s.lower() or 'insert ' in s.lower() or 'update ' in s.lower() or 'delete ' in s.lower()]
    menus = [s for s in decoded if 'menu' in s.lower() or 'mnu' in s.lower() or 'rpt' in s.lower()]

    print(f"Total Strings Extracted: {len(decoded)}")
    print(f"Forms Found: {len(forms)}")
    print(f"SQL Statements Found: {len(sqls)}")

    with open('B:\\himanshu uncle\\all_extracted_forms_menus.txt', 'w', encoding='utf-8') as out:
        out.write("=== FORMS & REPORTS ===\n")
        out.write('\n'.join(set(forms)))
        out.write("\n\n=== SQL QUERIES & TABLES ===\n")
        out.write('\n'.join(set(sqls)))
        out.write("\n\n=== MENUS & COMMANDS ===\n")
        out.write('\n'.join(set(menus)))

if __name__ == '__main__':
    decompile_exe_strings(r"B:\himanshu uncle\AryanNewsAgency.exe")
