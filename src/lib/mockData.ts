import { 
  Region, Area, Publisher, Publication, PublicationRate, Hawker, Collector, 
  Customer, CustomerDetail, CounterSale, Purchase, Bill, Receipt, Holiday,
  ReceiptIssue, AgencyMessage, PublicationSup
} from './types';

export const mockRegions: Region[] = [
  { region_id: 1, region_name: 'Central City Zone A' },
  { region_id: 2, region_name: 'North Railway Colony' },
  { region_id: 3, region_name: 'South Extension Market' },
  { region_id: 4, region_name: 'West Industrial Estate' }
];

export const mockAreas: Area[] = [
  { area_id: 1, area_name: 'Sector 1 - Civil Lines' },
  { area_id: 2, area_name: 'Sector 4 - Main Market' },
  { area_id: 3, area_name: 'Station Road Colony' },
  { area_id: 4, area_name: 'Model Town Block B' }
];

export const mockPublishers: Publisher[] = [
  { publisher_id: 1, name: 'Dainik Bhaskar Group', city: 'Bhopal', state: 'MP', phone: '0755-255441', mobile: '9826011111', email: 'sales@bhaskar.com', category: 'Daily Newspaper' },
  { publisher_id: 2, name: 'Jagran Prakashan Ltd', city: 'Kanpur', state: 'UP', phone: '0512-2216161', mobile: '9839022222', email: 'info@jagran.com', category: 'Daily Newspaper' },
  { publisher_id: 3, name: 'The Times Group (BCCL)', city: 'New Delhi', state: 'Delhi', phone: '011-23321234', mobile: '9811033333', email: 'dist@timesgroup.com', category: 'English Daily' },
  { publisher_id: 4, name: 'India Today Media', city: 'Noida', state: 'UP', phone: '0120-4807100', mobile: '9810044444', email: 'subscriptions@indiatoday.com', category: 'Magazine & Periodicals' }
];

export const mockPublications: Publication[] = [
  { publication_id: 1, public_name: 'Dainik Bhaskar', pub_hindi: 'दैनिक भास्कर', type_p: 'Daily', publisher_id: 1, abrv: 'DB', circulation: 'Morning', chr_del: true },
  { publication_id: 2, public_name: 'Dainik Jagran', pub_hindi: 'दैनिक जागरण', type_p: 'Daily', publisher_id: 2, abrv: 'DJ', circulation: 'Morning', chr_del: true },
  { publication_id: 3, public_name: 'The Times of India', pub_hindi: 'टाइम्स ऑफ इंडिया', type_p: 'Daily', publisher_id: 3, abrv: 'TOI', circulation: 'Morning', chr_del: true },
  { publication_id: 4, public_name: 'Navbharat Times', pub_hindi: 'नवभारत टाइम्स', type_p: 'Daily', publisher_id: 3, abrv: 'NBT', circulation: 'Morning', chr_del: true },
  { publication_id: 5, public_name: 'India Today (Hindi)', pub_hindi: 'इंडिया टुडे (हिंदी)', type_p: 'Weekly', publisher_id: 4, abrv: 'IT-H', circulation: 'Morning', chr_del: false },
  { publication_id: 6, public_name: 'Pratiyogita Darpan', pub_hindi: 'प्रतियोगिता दर्पण', type_p: 'Monthly', publisher_id: 4, abrv: 'PD', circulation: 'Morning', chr_del: false }
];

export const mockPublicationRates: PublicationRate[] = [
  { publication_id: 1, day_of_week: 1, rate: 5.00 },
  { publication_id: 1, day_of_week: 2, rate: 5.00 },
  { publication_id: 1, day_of_week: 3, rate: 5.00 },
  { publication_id: 1, day_of_week: 4, rate: 5.00 },
  { publication_id: 1, day_of_week: 5, rate: 5.00 },
  { publication_id: 1, day_of_week: 6, rate: 5.00 },
  { publication_id: 1, day_of_week: 7, rate: 7.00 },

  { publication_id: 2, day_of_week: 1, rate: 4.50 },
  { publication_id: 2, day_of_week: 2, rate: 4.50 },
  { publication_id: 2, day_of_week: 3, rate: 4.50 },
  { publication_id: 2, day_of_week: 4, rate: 4.50 },
  { publication_id: 2, day_of_week: 5, rate: 4.50 },
  { publication_id: 2, day_of_week: 6, rate: 4.50 },
  { publication_id: 2, day_of_week: 7, rate: 6.50 },

  { publication_id: 3, day_of_week: 1, rate: 6.00 },
  { publication_id: 3, day_of_week: 2, rate: 6.00 },
  { publication_id: 3, day_of_week: 3, rate: 6.00 },
  { publication_id: 3, day_of_week: 4, rate: 6.00 },
  { publication_id: 3, day_of_week: 5, rate: 6.00 },
  { publication_id: 3, day_of_week: 6, rate: 6.00 },
  { publication_id: 3, day_of_week: 7, rate: 8.50 },
];

export const mockHawkers: Hawker[] = [
  { hawker_id: 1, name: 'Ramesh Kumar (रामेश कुमार)', mobile: '9827012345', phone: '0755-244111', address: 'Quarter 42, Railway Colony', region_id: 1, region_name: 'Central City Zone A' },
  { hawker_id: 2, name: 'Suresh Sharma (सुरेश शर्मा)', mobile: '9827067890', phone: '0755-244222', address: 'House 108, Civil Lines', region_id: 2, region_name: 'North Railway Colony' },
  { hawker_id: 3, name: 'Vikram Singh (विक्रम सिंह)', mobile: '9827099887', phone: '0755-244333', address: 'Plot 15, Industrial Area', region_id: 3, region_name: 'South Extension Market' }
];

export const mockCollectors: Collector[] = [
  { collect_id: 1, name: 'Amit Verma (अमित वर्मा)', phone: '9425011223', address: 'Station Road, Shop 4' },
  { collect_id: 2, name: 'Rajesh Gupta (राजेश गुप्ता)', phone: '9425044556', address: 'Market Yard Gate 2' }
];

export const mockReceiptIssues: ReceiptIssue[] = [
  { issue_id: 1, collect_id: 1, collector_name: 'Amit Verma', receipt_from: 101, receipt_to: 200, issue_date: '2026-07-01' },
  { issue_id: 2, collect_id: 2, collector_name: 'Rajesh Gupta', receipt_from: 201, receipt_to: 300, issue_date: '2026-07-01' }
];

export const mockCustomers: Customer[] = [
  { customer_id: 1, name_eng: 'Sharma Ji (H.N. Sharma)', name_hindi: 'एच. एन. शर्मा', cust_type: 'Regular', add1: 'House No 120, Sector 4', hindi_add: 'मकान न. 120, सेक्टर 4', phone: '9826012345', security_deposit: 500, priority: 1, due_amount: 320.00, c_bal: 0.00, region_id: 1, region_name: 'Central City Zone A', paid_status: 'Unpaid', govt_supply: false },
  { customer_id: 2, name_eng: 'Gupta Medical Store', name_hindi: 'गुप्ता मेडिकल स्टोर', cust_type: 'Retail', add1: 'Shop 14, Main Market Road', hindi_add: 'दुकान 14, मुख्य बाज़ार', phone: '9826098765', security_deposit: 1000, priority: 2, due_amount: 0.00, c_bal: 150.00, region_id: 1, region_name: 'Central City Zone A', paid_status: 'Paid', govt_supply: false },
  { customer_id: 3, name_eng: 'Collectorate Office (Publicity)', name_hindi: 'कलेक्टोरेट कार्यालय', cust_type: 'Govt', add1: 'Block A, District HQ', hindi_add: 'ब्लॉक ए, जिला मुख्यालय', phone: '0755-288990', security_deposit: 0, priority: 3, due_amount: 1450.00, c_bal: 0.00, region_id: 2, region_name: 'North Railway Colony', paid_status: 'Unpaid', govt_supply: true },
  { customer_id: 4, name_eng: 'Rajesh Traders', name_hindi: 'राजेश ट्रेडर्स', cust_type: 'Agent', add1: 'Gali No 3, Station Road', hindi_add: 'गली न. 3, स्टेशन रोड', phone: '9425012345', security_deposit: 2000, priority: 1, due_amount: 820.00, c_bal: 0.00, region_id: 3, region_name: 'South Extension Market', paid_status: 'Partial', govt_supply: false }
];

export const mockCustomerDetails: CustomerDetail[] = [
  { sno: 1, customer_id: 1, publication_id: 1, publication_name: 'Dainik Bhaskar', hawker_id: 1, hawker_name: 'Ramesh Kumar', qty: 1, circulation: 'Morning', delivery_days: [1,2,3,4,5,6,7], s_date: '2025-01-01', discount_percent: 0, discount: 0.00, delivery_charge: 30.00 },
  { sno: 2, customer_id: 1, publication_id: 3, publication_name: 'The Times of India', hawker_id: 1, hawker_name: 'Ramesh Kumar', qty: 1, circulation: 'Morning', delivery_days: [1,2,3,4,5,6,7], s_date: '2025-01-01', discount_percent: 0, discount: 0.00, delivery_charge: 0.00 },
  { sno: 3, customer_id: 2, publication_id: 1, publication_name: 'Dainik Bhaskar', hawker_id: 1, hawker_name: 'Ramesh Kumar', qty: 2, circulation: 'Morning', delivery_days: [1,2,3,4,5,6,7], s_date: '2025-02-15', discount_percent: 5, discount: 5.00, delivery_charge: 40.00 },
  { sno: 4, customer_id: 3, publication_id: 2, publication_name: 'Dainik Jagran', hawker_id: 2, hawker_name: 'Suresh Sharma', qty: 5, circulation: 'Morning', delivery_days: [1,2,3,4,5,6], s_date: '2025-01-01', discount_percent: 10, discount: 10.00, delivery_charge: 100.00 },
  { sno: 5, customer_id: 4, publication_id: 1, publication_name: 'Dainik Bhaskar', hawker_id: 3, hawker_name: 'Vikram Singh', qty: 3, circulation: 'Morning', delivery_days: [1,2,3,4,5,6,7], s_date: '2025-03-01', discount_percent: 0, discount: 0.00, delivery_charge: 50.00 }
];

export const mockCounterSales: CounterSale[] = [
  { sale_id: 1, publication_id: 1, publication_name: 'Dainik Bhaskar', qty: 15, rate: 5.00, amt: 75.00, sale_date: '2026-07-30' },
  { sale_id: 2, publication_id: 3, publication_name: 'The Times of India', qty: 10, rate: 6.00, amt: 60.00, sale_date: '2026-07-30' },
  { sale_id: 3, publication_id: 5, publication_name: 'India Today (Hindi)', qty: 4, rate: 45.00, amt: 180.00, sale_date: '2026-07-29' }
];

export const mockPurchases: Purchase[] = [
  {
    purchase_id: 1,
    publisher_id: 1,
    publisher_name: 'Dainik Bhaskar Group',
    bill_no: 'INV-DB-8891',
    bill_date: '2026-07-01',
    r_date: '2026-07-01',
    total: 12500.00,
    add_less: -250.00,
    net_amt: 12250.00,
    items: [
      { publication_id: 1, publication_name: 'Dainik Bhaskar', qty: 2500, rate: 4.20, amt: 10500.00 },
      { publication_id: 4, publication_name: 'Navbharat Times', qty: 500, rate: 4.00, amt: 2000.00 }
    ]
  }
];

export const mockBills: Bill[] = [
  { bill_id: 101, customer_id: 1, customer_name: 'Sharma Ji (H.N. Sharma)', name_hindi: 'एच. एन. शर्मा', region_name: 'Central City Zone A', bill_month: 'June', bill_year: 2026, total_copies: 60, paper_amount: 310.00, delivery_amount: 30.00, discount_amount: 0.00, previous_due: 120.00, net_payable: 460.00, status: 'Unpaid', bill_date: '2026-07-01' },
  { bill_id: 102, customer_id: 2, customer_name: 'Gupta Medical Store', name_hindi: 'गुप्ता मेडिकल स्टोर', region_name: 'Central City Zone A', bill_month: 'June', bill_year: 2026, total_copies: 120, paper_amount: 620.00, delivery_amount: 40.00, discount_amount: 50.00, previous_due: 0.00, net_payable: 610.00, status: 'Paid', bill_date: '2026-07-01' },
  { bill_id: 103, customer_id: 3, customer_name: 'Collectorate Office', name_hindi: 'कलेक्टोरेट कार्यालय', region_name: 'North Railway Colony', bill_month: 'June', bill_year: 2026, total_copies: 300, paper_amount: 1350.00, delivery_amount: 100.00, discount_amount: 100.00, previous_due: 500.00, net_payable: 1850.00, status: 'Unpaid', bill_date: '2026-07-01' }
];

export const mockReceipts: Receipt[] = [
  { receipt_id: 201, receipt_no: 'REC-2026-001', customer_id: 2, customer_name: 'Gupta Medical Store', collect_id: 1, collector_name: 'Amit Verma', bill_id: 102, receipt_date: '2026-07-05', bill_amount: 610.00, receipt_amount: 610.00, less_amount: 0.00, balance_amount: 0.00, payment_mode: 'UPI', remarks: 'Paid via PhonePe' }
];

export const mockHolidays: Holiday[] = [
  { holiday_id: 1, occasion: 'Diwali Main Day', oc_date: '2026-11-01', publication_id: 1, publication_name: 'Dainik Bhaskar' },
  { holiday_id: 2, occasion: 'Holi Dhulandi', oc_date: '2026-03-04', publication_id: 2, publication_name: 'Dainik Jagran' }
];

export const mockPublicationSups: PublicationSup[] = [
  { sup_id: 1, publication_id: 1, publication_name: 'Dainik Bhaskar (Sunday Magazine)', month: 'July', year: 2026, region_name: 'Central City Zone A' }
];

export const mockMessages: AgencyMessage[] = [
  { message_id: 1, dated: '2026-07-30', message: 'Monthly bill calculations for July start on 1st August. Ensure all receipt entries are recorded.' }
];
