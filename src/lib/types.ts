export interface Region {
  region_id: number;
  region_name: string;
}

export interface Area {
  area_id: number;
  area_name: string;
}

export interface Publisher {
  publisher_id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  website?: string;
  category?: 'Newspaper' | 'Magzine' | 'Both' | string;
  type?: 'Publisher' | 'Dealer' | string;
}

export interface Publication {
  publication_id: number;
  public_name: string;
  pub_hindi?: string;
  type_p: 'Daily' | 'Weekly' | 'Monthly' | 'Magazine';
  publisher_id?: number;
  abrv: string;
  circulation: 'Morning' | 'Evening';
  chr_del: boolean;
}

export interface PublicationRate {
  rate_id?: number;
  publication_id: number;
  day_of_week: number; // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun
  rate: number;
}

export interface RateChange {
  change_id: number;
  publication_id: number;
  old_rate: number;
  new_rate: number;
  effective_date: string;
  day_of_week: number;
}

export interface Hawker {
  hawker_id: number;
  name: string;
  phone?: string;
  mobile?: string;
  address?: string;
  region_id?: number;
  region_name?: string;
}

export interface Collector {
  collect_id: number;
  name: string;
  phone?: string;
  address?: string;
}

export interface ReceiptIssue {
  issue_id: number;
  collect_id: number;
  collector_name?: string;
  receipt_from: number;
  receipt_to: number;
  issue_date: string;
  return_date?: string;
}

export interface Customer {
  customer_id: number;
  name_eng: string;
  name_hindi?: string;
  cust_type: 'Regular' | 'Agent' | 'Retail' | 'Govt';
  add1?: string;
  add2?: string;
  hindi_add?: string;
  phone?: string;
  security_deposit: number;
  priority: number;
  due_amount: number;
  c_bal: number;
  region_id?: number;
  region_name?: string;
  paid_status: 'Paid' | 'Unpaid' | 'Partial';
  govt_supply: boolean;
}

export interface CustomerDetail {
  sno: number;
  customer_id: number;
  publication_id: number;
  publication_name?: string;
  hawker_id?: number;
  hawker_name?: string;
  qty: number;
  circulation: 'Morning' | 'Evening';
  delivery_days: number[]; // [1,2,3,4,5,6,7] (1=Mon..7=Sun), default all 7 days
  s_date: string;
  c_date?: string;
  discount_percent: number; // Discount percentage (e.g. 5, 10, 15%)
  discount: number;
  delivery_charge: number; // Delivery charges for this specific publication
}

export interface CounterSale {
  sale_id: number;
  publication_id: number;
  publication_name?: string;
  qty: number;
  rate: number;
  amt: number;
  sale_date: string;
}

export interface Purchase {
  purchase_id: number;
  publisher_id: number;
  publisher_name?: string;
  bill_no: string;
  bill_date: string;
  r_date: string;
  total: number;
  add_less: number;
  net_amt: number;
  items?: PurchaseDetail[];
}

export interface PurchaseDetail {
  purchase_detail_id?: number;
  purchase_id?: number;
  publication_id: number;
  publication_name?: string;
  qty: number;
  rate: number;
  amt: number;
}

export interface Bill {
  bill_id: number;
  customer_id: number;
  customer_name?: string;
  name_hindi?: string;
  region_name?: string;
  bill_month: string;
  bill_year: number;
  total_copies: number;
  paper_amount: number;
  delivery_amount: number;
  discount_amount: number;
  previous_due: number;
  net_payable: number;
  status: 'Paid' | 'Unpaid' | 'Partial';
  bill_date: string;
}

export interface Receipt {
  receipt_id: number;
  receipt_no: string;
  customer_id: number;
  customer_name?: string;
  collect_id?: number;
  collector_name?: string;
  bill_id?: number;
  receipt_date: string;
  bill_amount: number;
  receipt_amount: number;
  less_amount: number;
  balance_amount: number;
  payment_mode: 'Cash' | 'UPI' | 'Cheque' | 'Bank Transfer';
  remarks?: string;
}

export interface Holiday {
  holiday_id: number;
  occasion: string;
  oc_date: string;
  publication_id?: number;
  publication_name?: string;
}

export interface PublicationSup {
  sup_id: number;
  publication_id: number;
  publication_name?: string;
  month: string;
  year: number;
  region_name?: string;
}

export interface AgencyMessage {
  message_id: number;
  dated: string;
  message: string;
}
