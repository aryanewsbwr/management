import { Customer, Hawker, CounterSale, Bill, Receipt, Publisher } from './types';

export function queryAIAssistant(
  prompt: string,
  data: {
    customers: Customer[];
    hawkers: Hawker[];
    bills: Bill[];
    counterSales: CounterSale[];
    receipts: Receipt[];
    publishers: Publisher[];
  }
): { text: string; tableData?: any[]; actionType?: string } {
  const p = prompt.toLowerCase().trim();

  // 1. Query Dues / Unpaid Customers
  if (p.includes('due') || p.includes('unpaid') || p.includes('balance') || p.includes('बकाया')) {
    const unpaidCusts = data.customers.filter(c => c.due_amount > 0);
    const totalDue = unpaidCusts.reduce((acc, c) => acc + c.due_amount, 0);

    if (unpaidCusts.length === 0) {
      return { text: "🎉 Great news! There are currently no outstanding customer dues in the system." };
    }

    return {
      text: `Found ${unpaidCusts.length} customer(s) with outstanding dues totaling ₹${totalDue.toLocaleString('en-IN')}:`,
      tableData: unpaidCusts.map(c => ({
        ID: c.customer_id,
        "Customer Name": `${c.name_eng} (${c.name_hindi || ''})`,
        "Region": c.region_name || 'N/A',
        "Phone": c.phone || 'N/A',
        "Due Amount": `₹${c.due_amount}`
      })),
      actionType: 'dues'
    };
  }

  // 2. Query Hawkers / Delivery Boys
  if (p.includes('hawker') || p.includes('delivery') || p.includes('हॉकर') || p.includes('route')) {
    return {
      text: `Here is the current active Hawker & Route distribution list (${data.hawkers.length} hawkers):`,
      tableData: data.hawkers.map(h => ({
        ID: h.hawker_id,
        "Hawker Name": h.name,
        "Mobile": h.mobile || 'N/A',
        "Assigned Region": h.region_name || 'Unassigned',
        "Address": h.address || 'N/A'
      })),
      actionType: 'hawkers'
    };
  }

  // 3. Query Counter Sales / Retail
  if (p.includes('counter') || p.includes('retail') || p.includes('sale') || p.includes('बिक्री')) {
    const totalCounterAmt = data.counterSales.reduce((acc, s) => acc + s.amt, 0);
    const totalQty = data.counterSales.reduce((acc, s) => acc + s.qty, 0);

    return {
      text: `Total Counter Sales recorded: ${totalQty} copies sold generating ₹${totalCounterAmt.toLocaleString('en-IN')}:`,
      tableData: data.counterSales.map(s => ({
        Date: s.sale_date,
        Publication: s.publication_name || `Pub #${s.publication_id}`,
        "Qty Sold": s.qty,
        "Rate/Copy": `₹${s.rate}`,
        "Total Amount": `₹${s.amt}`
      })),
      actionType: 'sales'
    };
  }

  // 4. Query Publishers
  if (p.includes('publisher') || p.includes('vendor') || p.includes('प्रकाशक')) {
    return {
      text: `Registered newspaper & magazine publishers (${data.publishers.length}):`,
      tableData: data.publishers.map(pub => ({
        ID: pub.publisher_id,
        "Publisher Name": pub.name,
        "Category": pub.category || 'Newspaper',
        "City": pub.city || 'N/A',
        "Contact Mobile": pub.mobile || 'N/A'
      })),
      actionType: 'publishers'
    };
  }

  // 5. Query Bills & Receipts
  if (p.includes('receipt') || p.includes('collection') || p.includes('भुगतान') || p.includes('paid')) {
    const totalCollected = data.receipts.reduce((acc, r) => acc + r.receipt_amount, 0);

    return {
      text: `Total Collections recorded: ₹${totalCollected.toLocaleString('en-IN')} across ${data.receipts.length} receipt(s):`,
      tableData: data.receipts.map(r => ({
        "Receipt No": r.receipt_no,
        "Customer": r.customer_name,
        "Date": r.receipt_date,
        "Mode": r.payment_mode,
        "Amount Received": `₹${r.receipt_amount}`,
        "Remarks": r.remarks || '-'
      })),
      actionType: 'receipts'
    };
  }

  // General Summary / AI default response
  const totalDues = data.customers.reduce((acc, c) => acc + c.due_amount, 0);
  const totalSales = data.counterSales.reduce((acc, s) => acc + s.amt, 0);

  return {
    text: `🤖 **PaperFlow AI Agency Intelligence Summary**:\n- **Total Customers**: ${data.customers.length}\n- **Active Hawkers**: ${data.hawkers.length}\n- **Outstanding Dues**: ₹${totalDues.toLocaleString('en-IN')}\n- **Today Counter Sales**: ₹${totalSales.toLocaleString('en-IN')}\n\nYou can ask me specific questions like:\n• *"Show all unpaid customer dues"*\n• *"List hawker delivery routes"*\n• *"What are today's counter sales?"*\n• *"Show payment collection receipts"*`
  };
}
