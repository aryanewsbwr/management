import re

# 1. Patch holidays/page.tsx
filepath_holidays = r"B:\AI_Projects\aryan-news-agency\src\app\holidays\page.tsx"

with open(filepath_holidays, "r", encoding="utf-8") as f:
    content = f.read()

state_target = """const [holidays, setHolidays] = useState(mockHolidays);"""
state_replace = """const [holidays, setHolidays] = useState(mockHolidays);

  const aggregatedHolidays = Object.values(holidays.reduce((acc, curr) => {
    const key = `${curr.oc_date}_${curr.occasion}`;
    if (!acc[key]) {
      acc[key] = { ...curr, affected_pubs: [] };
    }
    if (curr.publication_name) {
      if (!acc[key].affected_pubs.includes(curr.publication_name)) {
        acc[key].affected_pubs.push(curr.publication_name);
      }
    }
    return acc;
  }, {} as Record<string, any>));"""

content = content.replace(state_target, state_replace)

tbody_target = """{holidays.map((h) => ("""
tbody_replace = """{aggregatedHolidays.map((h, idx) => ("""
content = content.replace(tbody_target, tbody_replace)

tr_target = """<tr key={h.holiday_id} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{h.holiday_id}</td>
                <td className="py-2.5 px-3 font-bold text-slate-900">{h.occasion}</td>
                <td className="py-2.5 px-3 text-indigo-600 font-bold">{h.oc_date}</td>
                <td className="py-2.5 px-3 text-slate-600">{h.publication_name || 'All Publications'}</td>
              </tr>"""
tr_replace = """<tr key={idx} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{h.holiday_id}</td>
                <td className="py-2.5 px-3 font-bold text-slate-900">{h.occasion === '1' ? 'General Holiday' : h.occasion}</td>
                <td className="py-2.5 px-3 text-indigo-600 font-bold">{h.oc_date}</td>
                <td className="py-2.5 px-3 text-slate-600">{h.affected_pubs.length > 0 ? h.affected_pubs.join(', ') : 'All Publications'}</td>
              </tr>"""
content = content.replace(tr_target, tr_replace)

records_target = """({holidays.length} Records)"""
records_replace = """({aggregatedHolidays.length} Records)"""
content = content.replace(records_target, records_replace)

with open(filepath_holidays, "w", encoding="utf-8") as f:
    f.write(content)


# 2. Patch publications/page.tsx (Holidays Tab)
filepath_pubs = r"B:\AI_Projects\aryan-news-agency\src\app\publications\page.tsx"
with open(filepath_pubs, "r", encoding="utf-8") as f:
    content_pubs = f.read()

# Add aggregatedHolidays before return if not there
if "const aggregatedHolidays =" not in content_pubs:
    target_pubs_state = """const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);"""
    replace_pubs_state = """const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const aggregatedHolidays = Object.values(holidays.reduce((acc, curr) => {
    const key = `${curr.oc_date}_${curr.occasion}`;
    if (!acc[key]) {
      acc[key] = { ...curr, affected_pubs: [] };
    }
    if (curr.publication_name) {
      if (!acc[key].affected_pubs.includes(curr.publication_name)) {
        acc[key].affected_pubs.push(curr.publication_name);
      }
    }
    return acc;
  }, {} as Record<string, any>));"""
    content_pubs = content_pubs.replace(target_pubs_state, replace_pubs_state)

target_pubs_tbody = """{holidays.map((h) => ("""
replace_pubs_tbody = """{aggregatedHolidays.map((h, idx) => ("""
content_pubs = content_pubs.replace(target_pubs_tbody, replace_pubs_tbody)

target_pubs_tr = """<tr key={h.holiday_id}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{h.oc_date}</td>
                      <td className="py-2.5 px-3 text-slate-700 font-bold">{h.occasion}</td>
                      <td className="py-2.5 px-3 text-indigo-600">{h.publication_name || 'All Publications'}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button onClick={() => setHolidays(holidays.filter(holiday => holiday.holiday_id !== h.holiday_id))} className="text-red-500 hover:text-red-700 mx-1"><Trash2 className="w-4 h-4 inline"/></button>
                      </td>
                    </tr>"""
replace_pubs_tr = """<tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{h.oc_date}</td>
                      <td className="py-2.5 px-3 text-slate-700 font-bold">{h.occasion === '1' ? 'General Holiday' : h.occasion}</td>
                      <td className="py-2.5 px-3 text-indigo-600">{h.affected_pubs.length > 0 ? h.affected_pubs.join(', ') : 'All Publications'}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button onClick={() => setHolidays(holidays.filter(holiday => holiday.oc_date !== h.oc_date))} className="text-red-500 hover:text-red-700 mx-1"><Trash2 className="w-4 h-4 inline"/></button>
                      </td>
                    </tr>"""
content_pubs = content_pubs.replace(target_pubs_tr, replace_pubs_tr)

with open(filepath_pubs, "w", encoding="utf-8") as f:
    f.write(content_pubs)

print("SUCCESS: Fixed holidays duplicates.")
