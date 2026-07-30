-- =========================================================
-- ARYAN NEWS AGENCY - SUPABASE (POSTGRESQL) SCHEMA MIGRATION
-- Replaces old 2008 MySQL database schema with modern relational structures
-- =========================================================

-- 1. Regions & Areas
CREATE TABLE IF NOT EXISTS regions (
    region_id SERIAL PRIMARY KEY,
    region_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS areas (
    area_id SERIAL PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Publishers
CREATE TABLE IF NOT EXISTS publishers (
    publisher_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    phone VARCHAR(30),
    mobile VARCHAR(30),
    fax VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(100),
    category VARCHAR(50),
    type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Publications (Newspapers & Magazines)
CREATE TABLE IF NOT EXISTS publications (
    publication_id SERIAL PRIMARY KEY,
    public_name VARCHAR(100) NOT NULL,
    pub_hindi VARCHAR(100),
    type_p VARCHAR(20) DEFAULT 'Daily', -- Daily, Weekly, Monthly, Magazine
    publisher_id INT REFERENCES publishers(publisher_id) ON DELETE SET NULL,
    abrv VARCHAR(10),
    circulation VARCHAR(30) DEFAULT 'Morning', -- Morning, Evening
    duration VARCHAR(20),
    magzine_day VARCHAR(20),
    magzine_month VARCHAR(20),
    chr_del BOOLEAN DEFAULT TRUE, -- Delivery Charge Flag
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Publication Day-of-Week Rates (1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun)
CREATE TABLE IF NOT EXISTS publication_rates (
    rate_id SERIAL PRIMARY KEY,
    publication_id INT REFERENCES publications(publication_id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    rate NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    UNIQUE (publication_id, day_of_week)
);

-- 5. Rate Change History
CREATE TABLE IF NOT EXISTS rate_changes (
    change_id SERIAL PRIMARY KEY,
    publication_id INT REFERENCES publications(publication_id) ON DELETE CASCADE,
    old_rate NUMERIC(10,2) NOT NULL,
    new_rate NUMERIC(10,2) NOT NULL,
    effective_date DATE NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Hawkers (Delivery Personnel)
CREATE TABLE IF NOT EXISTS hawkers (
    hawker_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(50),
    phone VARCHAR(30),
    mobile VARCHAR(30),
    region_id INT REFERENCES regions(region_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Collectors & Receipt Book Allotments
CREATE TABLE IF NOT EXISTS collectors (
    collect_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(50),
    phone VARCHAR(30),
    mobile VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS receipt_issues (
    issue_id SERIAL PRIMARY KEY,
    collect_id INT REFERENCES collectors(collect_id) ON DELETE SET NULL,
    receipt_from INT NOT NULL,
    receipt_to INT NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    return_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Customers
CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    name_eng VARCHAR(100) NOT NULL,
    name_hindi VARCHAR(100),
    cust_type VARCHAR(20) DEFAULT 'Regular', -- Regular, Agent, Retail, Govt
    add1 TEXT,
    add2 TEXT,
    hindi_add TEXT,
    phone VARCHAR(30),
    security_deposit NUMERIC(10,2) DEFAULT 0.00,
    priority INT DEFAULT 1,
    self_agent BOOLEAN DEFAULT FALSE,
    font_type BOOLEAN DEFAULT FALSE,
    due_amount NUMERIC(10,2) DEFAULT 0.00,
    c_bal NUMERIC(10,2) DEFAULT 0.00,
    region_id INT REFERENCES regions(region_id) ON DELETE SET NULL,
    paid_status VARCHAR(20) DEFAULT 'Unpaid',
    govt_supply BOOLEAN DEFAULT FALSE,
    pmonth VARCHAR(20),
    pyear VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Customer Subscription Details
CREATE TABLE IF NOT EXISTS customer_details (
    sno SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
    publication_id INT REFERENCES publications(publication_id) ON DELETE CASCADE,
    hawker_id INT REFERENCES hawkers(hawker_id) ON DELETE SET NULL,
    qty INT DEFAULT 1,
    circulation VARCHAR(30) DEFAULT 'Morning',
    s_date DATE DEFAULT CURRENT_DATE,
    c_date DATE, -- NULL if active subscription
    from_day VARCHAR(20),
    hawk_sub BOOLEAN DEFAULT FALSE,
    discount NUMERIC(10,2) DEFAULT 0.00,
    delivery_charge NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Holidays & Publication Discontinuations
CREATE TABLE IF NOT EXISTS holidays (
    holiday_id SERIAL PRIMARY KEY,
    occasion VARCHAR(100) NOT NULL,
    oc_date DATE NOT NULL,
    publication_id INT REFERENCES publications(publication_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS publication_discontinuations (
    dis_id SERIAL PRIMARY KEY,
    publication_id INT REFERENCES publications(publication_id) ON DELETE CASCADE,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Vendor Stock Purchases
CREATE TABLE IF NOT EXISTS purchases (
    purchase_id SERIAL PRIMARY KEY,
    publisher_id INT REFERENCES publishers(publisher_id) ON DELETE SET NULL,
    r_date DATE DEFAULT CURRENT_DATE,
    bill_no VARCHAR(50),
    bill_date DATE,
    total NUMERIC(10,2) DEFAULT 0.00,
    add_less NUMERIC(10,2) DEFAULT 0.00,
    net_amt NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_details (
    purchase_detail_id SERIAL PRIMARY KEY,
    purchase_id INT REFERENCES purchases(purchase_id) ON DELETE CASCADE,
    bill_no VARCHAR(50),
    publication_id INT REFERENCES publications(publication_id) ON DELETE CASCADE,
    qty INT DEFAULT 0,
    rate NUMERIC(10,2) DEFAULT 0.00,
    amt NUMERIC(10,2) DEFAULT 0.00
);

-- 12. Counter Sales (Retail Sales)
CREATE TABLE IF NOT EXISTS counter_sales (
    sale_id SERIAL PRIMARY KEY,
    publication_id INT REFERENCES publications(publication_id) ON DELETE CASCADE,
    qty INT DEFAULT 1,
    rate NUMERIC(10,2) DEFAULT 0.00,
    amt NUMERIC(10,2) DEFAULT 0.00,
    sale_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Generated Monthly Bills
CREATE TABLE IF NOT EXISTS bills (
    bill_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
    region_id INT REFERENCES regions(region_id) ON DELETE SET NULL,
    bill_month VARCHAR(20) NOT NULL, -- e.g., 'July'
    bill_year INT NOT NULL,          -- e.g., 2026
    total_copies INT DEFAULT 0,
    paper_amount NUMERIC(10,2) DEFAULT 0.00,
    delivery_amount NUMERIC(10,2) DEFAULT 0.00,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    previous_due NUMERIC(10,2) DEFAULT 0.00,
    net_payable NUMERIC(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'Unpaid', -- Unpaid, Partial, Paid
    bill_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Payment Receipts
CREATE TABLE IF NOT EXISTS receipts (
    receipt_id SERIAL PRIMARY KEY,
    receipt_no VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
    collect_id INT REFERENCES collectors(collect_id) ON DELETE SET NULL,
    bill_id INT REFERENCES bills(bill_id) ON DELETE SET NULL,
    receipt_date DATE DEFAULT CURRENT_DATE,
    bill_amount NUMERIC(10,2) DEFAULT 0.00,
    receipt_amount NUMERIC(10,2) DEFAULT 0.00,
    less_amount NUMERIC(10,2) DEFAULT 0.00,
    balance_amount NUMERIC(10,2) DEFAULT 0.00,
    payment_mode VARCHAR(30) DEFAULT 'Cash', -- Cash, UPI, Cheque, Bank Transfer
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
