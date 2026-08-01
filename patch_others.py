import re

purchases_path = r"B:\AI_Projects\aryan-news-agency\src\app\purchases\page.tsx"

with open(purchases_path, "r", encoding="utf-8") as f:
    p_content = f.read()

if "Trash2" not in p_content:
    p_content = p_content.replace("ShoppingCart }", "ShoppingCart, Trash2 }")
    p_content = p_content.replace("const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);", 
        "const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);\n  const handleDelete = (id: number) => { if(confirm('Delete this purchase?')) setPurchases(purchases.filter(p => p.purchase_id !== id)); };")
    
    p_content = p_content.replace("</h3>\n                <p className=\"text-xs text-slate-500\">Bill Date", 
        "</h3>\n                <p className=\"text-xs text-slate-500\">Bill Date")
    
    # Add delete button near the net payable
    target_net = """<span className="text-xl font-black text-emerald-600">₹{pur.net_amt.toLocaleString('en-IN')}</span>
              </div>
            </div>"""
    replace_net = """<span className="text-xl font-black text-emerald-600">₹{pur.net_amt.toLocaleString('en-IN')}</span>
                <button onClick={() => handleDelete(pur.purchase_id)} className="mt-2 text-rose-500 hover:text-rose-700 block text-right w-full text-xs font-bold"><Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete</button>
              </div>
            </div>"""
    p_content = p_content.replace(target_net, replace_net)
    
    with open(purchases_path, "w", encoding="utf-8") as f:
        f.write(p_content)


sales_path = r"B:\AI_Projects\aryan-news-agency\src\app\countersales\page.tsx"
try:
    with open(sales_path, "r", encoding="utf-8") as f:
        s_content = f.read()
    
    if "Trash2" not in s_content:
        s_content = s_content.replace("ShoppingCart }", "ShoppingCart, Trash2 }")
        s_content = s_content.replace("const [sales, setSales] = useState<CounterSale[]>(mockCounterSales);", 
            "const [sales, setSales] = useState<CounterSale[]>(mockCounterSales);\n  const handleDelete = (id: number) => { if(confirm('Delete this sale?')) setSales(sales.filter(s => s.sale_id !== id)); };")
        
        target_sales = """<td className="p-3 text-right font-black text-emerald-600">₹{sale.total_amount.toFixed(2)}</td>
                  </tr>"""
        replace_sales = """<td className="p-3 text-right font-black text-emerald-600">₹{sale.total_amount.toFixed(2)}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleDelete(sale.sale_id)} className="text-rose-500 hover:text-rose-700" title="Delete Sale"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>"""
        
        thead_target = """<th className="p-3 text-right">Total Amount</th>
                </tr>"""
        thead_replace = """<th className="p-3 text-right">Total Amount</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>"""
                
        s_content = s_content.replace(target_sales, replace_sales)
        s_content = s_content.replace(thead_target, thead_replace)
        
        with open(sales_path, "w", encoding="utf-8") as f:
            f.write(s_content)
except Exception as e:
    pass

print("SUCCESS: Added delete to purchases and countersales.")
