import re

filepath = r"B:\AI_Projects\aryan-news-agency\src\app\billing\page.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
if "ChevronLeft" not in content:
    content = content.replace("Settings2,", "Settings2, ChevronLeft, ChevronRight, Trash2,")

# 2. Add State and Logic for Pagination and Generate
state_target = """const [bills, setBills] = useState<Bill[]>(mockBills);"""
state_replace = """const [bills, setBills] = useState<Bill[]>(mockBills);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const paginatedBills = bills.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(bills.length / itemsPerPage);

  const handleDeleteBill = (id: number) => {
    if(confirm('Delete this generated bill?')) {
      setBills(bills.filter(b => b.bill_id !== id));
    }
  };

  // Improved Generate logic
  const executeGenerate = (month: string, year: number) => {
    alert(`Simulating bill generation for ${month} ${year} using active subscriptions from ${mockCustomers.length} customers...`);
    setIsGenerateModalOpen(false);
  };"""

content = content.replace(state_target, state_replace)

# 3. Modify "handleGenerateBills"
gen_target = """const handleGenerateBills = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would trigger backend generation based on selected Month/Year
    // For now, close modal
    setIsGenerateModalOpen(false);
  };"""
gen_replace = """const handleGenerateBills = (e: React.FormEvent) => {
    e.preventDefault();
    executeGenerate(genForm.month, genForm.year);
  };"""
content = content.replace(gen_target, gen_replace)

# 4. Table Header
thead_target = """<th className="p-3 text-center">Status</th>
                </tr>"""
thead_replace = """<th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>"""
content = content.replace(thead_target, thead_replace)

# 5. Table Body
tbody_target = """{bills.map((bill) => ("""
tbody_replace = """{paginatedBills.map((bill) => ("""
content = content.replace(tbody_target, tbody_replace)

td_target = """</span>
                    </td>
                  </tr>"""
td_replace = """</span>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleDeleteBill(bill.bill_id)} className="text-rose-500 hover:text-rose-700" title="Delete Bill">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>"""
content = content.replace(td_target, td_replace)

# 6. Pagination Controls
table_end_target = """</table>
          </div>
        </div>"""
table_end_replace = """</table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, bills.length)} of {bills.length} bills
              </p>
              <div className="flex items-center gap-2 text-xs">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-700">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>"""
content = content.replace(table_end_target, table_end_replace)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Added pagination and delete to billing.")
