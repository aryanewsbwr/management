import re
import os

filepath = r"B:\AI_Projects\aryan-news-agency\src\app\publications\page.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Rate Changes Table
rc_thead_target = """<th className="py-2 px-3">Effective Date</th>
                </tr>"""
rc_thead_replace = """<th className="py-2 px-3">Effective Date</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>"""

rc_tbody_target = """<td className="py-2.5 px-3 text-slate-500">{rc.effective_date}</td>
                  </tr>"""
rc_tbody_replace = """<td className="py-2.5 px-3 text-slate-500">{rc.effective_date}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button onClick={() => setRateChanges(rateChanges.filter(r => r.change_id !== rc.change_id))} className="text-red-500 hover:text-red-700 mx-1"><Trash2 className="w-4 h-4 inline"/></button>
                    </td>
                  </tr>"""

content = content.replace(rc_thead_target, rc_thead_replace)
content = content.replace(rc_tbody_target, rc_tbody_replace)

# 2. Holidays Table
hol_thead_target = """<th className="py-2 px-3">Affected Publications</th>
                </tr>"""
hol_thead_replace = """<th className="py-2 px-3">Affected Publications</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>"""

hol_tbody_target = """<td className="py-2.5 px-3 text-indigo-600">{h.publication_name || 'All Publications'}</td>
                  </tr>"""
hol_tbody_replace = """<td className="py-2.5 px-3 text-indigo-600">{h.publication_name || 'All Publications'}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button onClick={() => setHolidays(holidays.filter(holiday => holiday.holiday_id !== h.holiday_id))} className="text-red-500 hover:text-red-700 mx-1"><Trash2 className="w-4 h-4 inline"/></button>
                    </td>
                  </tr>"""

content = content.replace(hol_thead_target, hol_thead_replace)
content = content.replace(hol_tbody_target, hol_tbody_replace)

# 3. Press Discontinues Table
pd_thead_target = """<th className="py-2 px-3">To Date</th>
                </tr>"""
pd_thead_replace = """<th className="py-2 px-3">To Date</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>"""

pd_tbody_target = """<td className="py-2.5 px-3 text-slate-700 font-semibold">{pd.to_date}</td>
                  </tr>"""
pd_tbody_replace = """<td className="py-2.5 px-3 text-slate-700 font-semibold">{pd.to_date}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button onClick={() => setPressDiscontinues(pressDiscontinues.filter(p => p.pub_discontinue_id !== pd.pub_discontinue_id))} className="text-red-500 hover:text-red-700 mx-1"><Trash2 className="w-4 h-4 inline"/></button>
                    </td>
                  </tr>"""

content = content.replace(pd_thead_target, pd_thead_replace)
content = content.replace(pd_tbody_target, pd_tbody_replace)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Added delete buttons to rate changes, holidays, and press discontinues.")
