// ============================================================================
// VEXA IT (www.vexait.xyz) - Billing, Quotations & Invoice Data Models
// ============================================================================

export type CurrencyCode = 'LKR' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'AED' | 'SGD';

export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  billing_address?: string;
  tax_no?: string;
}

export interface LineItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  tax_rate?: number;
  total: number;
}

export interface PaymentRecord {
  id: string;
  payment_date: string;
  amount: number;
  method: 'bank_transfer' | 'online_gateway' | 'cheque' | 'cash' | 'other';
  reference_no?: string;
  notes?: string;
  recorded_by?: string;
  created_at: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';

export interface Quotation {
  id: string;
  quote_number: string;
  client: Client;
  items: LineItem[];
  currency: CurrencyCode;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  tax_rate: number;
  tax_label: string;
  extra_fee: number;
  extra_fee_label: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  issue_date: string;
  valid_until: string;
  status: QuotationStatus;
  notes?: string;
  terms: string;
  bank_details: string;
  prepared_by: string;
  authorized_by: string;
  converted_invoice_id?: string;
  created_at: string;
  updated_at: string;
}

export type InvoiceStatus = 'draft' | 'unpaid' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoice_number: string;
  quote_id?: string;
  quote_number?: string;
  client: Client;
  items: LineItem[];
  currency: CurrencyCode;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  tax_rate: number;
  tax_label: string;
  extra_fee: number;
  extra_fee_label: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  notes?: string;
  terms: string;
  bank_details: string;
  payments: PaymentRecord[];
  reminders_enabled: boolean;
  prepared_by: string;
  authorized_by: string;
  created_at: string;
  updated_at: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  category: string;
  description: string;
  unit: string;
  default_price: number;
  default_tax: number;
}

export interface BillingSettings {
  company_name: string;
  tagline: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  registration_no: string;
  tax_vat_no: string;
  default_currency: CurrencyCode;
  default_quote_validity_days: number;
  default_invoice_due_days: number;
  default_tax_rate: number;
  default_tax_label: string;
  quote_prefix: string;
  invoice_prefix: string;
  default_quote_terms: string;
  default_invoice_terms: string;
  default_bank_details: string;
  auto_reminders_enabled: boolean;
}
