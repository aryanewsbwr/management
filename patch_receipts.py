import re

filepath = r"B:\AI_Projects\aryan-news-agency\src\app\receipts\page.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add icons to imports if missing
if "Trash2" not in content:
    content = content.replace("CreditCard", "CreditCard, Trash2, Edit, ChevronLeft, ChevronRight")

# Inject Pagination State
state_target = """const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);"""
state_replace = """const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const totalPages = Math.ceil(receipts.length / itemsPerPage);
  const paginatedReceipts = receipts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      setReceipts(receipts.filter(r => r.receipt_id !== id));
    }
  };"""

content = content.replace(state_target, state_replace)

# Modify the table header
thead_target = """<th className="p-3 text-center">Status</th>
              </tr>"""
thead_replace = """<th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>"""
content = content.replace(thead_target, thead_replace)

# Modify the table body to use paginatedReceipts and add Action buttons
tbody_target = """{receipts.map((rec) => ("""
tbody_replace = """{paginatedReceipts.map((rec) => ("""
content = content.replace(tbody_target, tbody_replace)

td_target = """</span>
                  </td>
                </tr>"""
td_replace = """</span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(rec.receipt_id)} className="text-rose-500 hover:text-rose-700 mx-1" title="Delete Receipt">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>"""
content = content.replace(td_target, td_replace)

# Add pagination controls below the table
pagination_target = """</table>
        </div>"""
pagination_replace = """</table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, receipts.length)} of {receipts.length} receipts
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
        )}"""
content = content.replace(pagination_target, pagination_replace)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Added pagination and delete actions to receipts.")
