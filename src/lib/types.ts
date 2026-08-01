export interface Region {
  region_id: number;
  region_name: string;
  name_hindi?: string;
  zone?: string;
  hawker_count?: number;
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

export interface PublicationSup {
  sup_id?: number;
  publica_id?: number;
  publication_id?: number;
  publication_name?: string;
  supname: string;
  month?: string;
  year?: number;
  region_name?: string;
}

export interface Publication {
  publication_id: number;
  public_name: string;
  pub_hindi?: string;
  pub_name_hindi?: string;
  type_p: 'Daily' | 'Weekly' | 'Monthly' | 'Magazine';
  publisher_id?: number;
  publisher_name?: string;
  abrv?: string;
  abrevation?: string;
  circulation?: 'Morning' | 'Evening' | string;
  chr_del?: boolean;
  rate?: number;
  duration?: string;
  pub_day?: string;
  pub_month?: string;
  publishing_day?: string;
  is_active?: boolean;
}

export interface PublicationRate {
  rate_id?: number;
  publication_id: number;
  publication_name?: string;
  day_of_week?: number;
  rate_mon?: number;
  rate_tue?: number;
  rate_wed?: number;
  rate_thu?: number;
  rate_fri?: number;
  rate_sat?: number;
  rate_sun?: number;
  rate?: number;
}

export interface RateChange {
  change_id: number;
  publication_id: number;
  publication_name?: string;
  type_p?: string;
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
  city?: string;
  region_id?: number;
  region_name?: string;
  assigned_regions?: number[]; // Multi-select assigned regions
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
  book_no?: string;
  receipt_from: number;
  receipt_to: number;
  start_no?: number;
  end_no?: number;
  issue_date: string;
  issued_date?: string;
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
  priority: number; // Route delivery sequence
  due_amount: number;
  c_bal: number;
  region_id?: number;
  region_name?: string;
  paid_status: 'Paid' | 'Unpaid' | 'Partial';
  govt_supply: boolean;
  is_sub_agent?: boolean;
  is_self?: boolean;
  sub_agent_id?: number;
  sub_agent_name?: string;
  susha_05?: boolean;
}

export interface CustomerDetail {
  sno: number;
  customer_id: number;
  publication_id: number;
  publication_name?: string;
  hawker_id?: number;
  hawker_name?: string;
  qty: number;
  circulation: 'Morning' | 'Evening' | string;
  delivery_days: number[]; // [1,2,3,4,5,6,7] (1=Mon..7=Sun), default all 7 days
  s_date: string;
  c_date?: string;
  discount_percent: number; // Discount percentage (e.g. 5, 10, 15%)
  discount: number;
  delivery_charge: number; // Delivery charges for this specific publication
  hw_sa?: 'Hawker' | 'SubAgent';
}

export interface CustomerDiscontinue {
  discontinue_id: number;
  customer_id: number;
  customer_name?: string;
  publication_id: number;
  publication_name?: string;
  hawker_id?: number;
  hawker_name?: string;
  type: 'Temporary' | 'Permanent';
  from_date: string;
  to_date?: string;
  entry_date: string;
  period: string;
}

export interface PublicationDiscontinue {
  pub_discontinue_id: number;
  publication_id: number;
  publication_name?: string;
  from_date: string;
  to_date: string;
}

export interface CounterSale {
  sale_id: number;
  publication_id: number;
  publication_name?: string;
  qty: number;
  rate: number;
  amt: number;
  sale_date: string;
  period?: string;
  customer_name?: string;
  narration?: string;
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
  region_id?: number;
  region_name?: string;
  bill_month: string;
  bill_year: number;
  total_copies: number;
  paper_amount: number;
  delivery_amount: number;
  discount_amount: number;
  previous_due: number;
  total_amount?: number;
  net_payable: number;
  status: 'Paid' | 'Unpaid' | 'Partial';
  bill_date?: string;
  generated_date?: string;
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
  manual_rcp_amt?: number;
  receipt_amount: number;
  less_amount: number;
  balance_amount: number;
  manual_rcp_no?: string;
  manual_rcp_date?: string;
  payment_mode: 'Cash' | 'Cheque' | 'UPI' | 'Bank Transfer';
  cheque_no?: string;
  cheque_date?: string;
  remarks?: string;
}

export interface Holiday {
  holiday_id: number;
  occasion: string;
  oc_date: string;
  publication_id?: number;
  publication_name?: string;
  affected_publications?: number[]; // Multi-select publications
}

export interface AgencyMessage {
  message_id: number;
  dated: string;
  message: string;
}

export interface FinancialPeriod {
  starting_year: number;
  ending_year: number;
  active_month: string;
}
