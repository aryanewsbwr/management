import { Customer, CustomerDetail, PublicationRate, Holiday, Bill } from './types';

export function calculateMonthlyBill(
  customer: Customer,
  subscriptions: CustomerDetail[],
  rates: PublicationRate[],
  holidays: Holiday[],
  monthName: string,
  year: number
): Bill {
  const monthMap: { [key: string]: number } = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3,
    'May': 4, 'June': 5, 'July': 6, 'August': 7,
    'September': 8, 'October': 9, 'November': 10, 'December': 11
  };

  const monthIdx = monthMap[monthName] ?? 6;
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  let totalCopies = 0;
  let totalPaperAmt = 0;
  let totalDeliveryAmt = 0;
  let totalDiscountAmt = 0;

  const activeSubs = subscriptions.filter(s => s.customer_id === customer.customer_id && (!s.c_date || new Date(s.c_date) >= new Date(year, monthIdx, 1)));

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, monthIdx, day);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat -> Convert to 1=Mon, ..., 7=Sun
    const jsDay = currentDate.getDay();
    const dayOfWeek = jsDay === 0 ? 7 : jsDay;

    for (const sub of activeSubs) {
      // Check holiday for this publication on date
      const isHoliday = holidays.some(h => 
        h.publication_id === sub.publication_id && 
        h.oc_date === dateStr
      );

      if (isHoliday) continue; // No paper delivered on holiday

      // Find rate for this publication & day of week
      const rateObj = rates.find(r => r.publication_id === sub.publication_id && r.day_of_week === dayOfWeek);
      const copyPrice = rateObj ? rateObj.rate : 5.00;

      totalCopies += sub.qty;
      totalPaperAmt += copyPrice * sub.qty;
    }
  }

  // Monthly flat delivery and discount calculations
  for (const sub of activeSubs) {
    totalDeliveryAmt += sub.delivery_charge || 0;
    totalDiscountAmt += sub.discount || 0;
  }

  const previousDue = customer.due_amount || 0;
  const netPayable = Math.max(0, (totalPaperAmt + totalDeliveryAmt - totalDiscountAmt + previousDue));

  return {
    bill_id: Math.floor(1000 + Math.random() * 9000),
    customer_id: customer.customer_id,
    customer_name: customer.name_eng,
    name_hindi: customer.name_hindi,
    region_name: customer.region_name,
    bill_month: monthName,
    bill_year: year,
    total_copies: totalCopies,
    paper_amount: Number(totalPaperAmt.toFixed(2)),
    delivery_amount: Number(totalDeliveryAmt.toFixed(2)),
    discount_amount: Number(totalDiscountAmt.toFixed(2)),
    previous_due: Number(previousDue.toFixed(2)),
    net_payable: Number(netPayable.toFixed(2)),
    status: 'Unpaid',
    bill_date: new Date().toISOString().split('T')[0]
  };
}
