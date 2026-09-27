import {
  BillingSettings,
  CatalogItem,
  CurrencyCode,
  Invoice,
  LineItem,
  Quotation,
} from '../types/billing';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  LKR: 'Rs. ',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  AED: 'AED ',
  SGD: 'S$',
};

export const DEFAULT_BILLING_SETTINGS: BillingSettings = {
  company_name: 'VEXA IT SOLUTIONS (PVT) LTD',
  tagline: 'Enterprise Digital Solutions & Software Engineering',
  website: 'www.vexait.xyz',
  email: 'vexa.it2026@gmail.com',
  phone: '+94 71 269 6668',
  address: 'No. 18, Galle Face Terrace, Colombo 03, Sri Lanka',
  registration_no: 'PV 00298415',
  tax_vat_no: 'VAT-114592019-7000',
  default_currency: 'LKR',
  default_quote_validity_days: 30,
  default_invoice_due_days: 14,
  default_tax_rate: 0,
  default_tax_label: 'VAT / SSCL',
  quote_prefix: 'VEXA-QUO',
  invoice_prefix: 'VEXA-INV',
  default_quote_terms: `1. Commercial Validity: This quotation remains valid for 30 calendar days from the date of issuance.
2. Payment Milestone Schedule:
   • 50% Advance deposit upon quotation acceptance and project sign-off to initiate engineering.
   • 25% Interim milestone payment upon Beta / UAT preview approval.
   • 25% Final settlement upon live production deployment, DNS handover, and source code transfer.
3. Warranty & SLA Support: Includes 60 days of complimentary post-deployment technical maintenance and bug fixes.
4. Intellectual Property: Complete source code ownership and intellectual property transfer to the client upon final settlement.`,
  default_invoice_terms: `1. Payment Due: Payment is required within 14 calendar days from the date of invoice issue.
2. Settlement: Direct electronic bank transfer (CEFT / SLIPS) or online corporate payment gateway.
3. Official Receipt: An official digital acknowledgment will be generated immediately upon fund receipt.
4. Thank you for partnering with VEXA IT Solutions (www.vexait.xyz) for your digital transformation!`,
  default_bank_details: `Bank Name: Commercial Bank of Ceylon PLC
Account Name: VEXA IT SOLUTIONS (PVT) LTD
Account Number: 8009214782
Branch: Colombo Fort (Branch Code: 045)
SWIFT / BIC: CCEYLKLX
Payment Reference: Please quote the Quotation or Invoice reference number`,
  auto_reminders_enabled: true,
};

export const DEFAULT_CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'cat-1',
    title: 'Custom Corporate Web Application',
    category: 'Web Development',
    description: 'Full-stack responsive web platform, customer portal, role-based auth, and scalable cloud database.',
    unit: 'project',
    default_price: 185000,
    default_tax: 0,
  },
  {
    id: 'cat-2',
    title: 'E-Commerce Platform & Payment Gateway',
    category: 'E-Commerce',
    description: 'Custom store frontend, inventory sync, automated PDF invoices, and IPG payment integration.',
    unit: 'project',
    default_price: 240000,
    default_tax: 0,
  },
  {
    id: 'cat-3',
    title: 'Executive UI/UX Interactive Design System',
    category: 'UI/UX Design',
    description: 'Figma wireframes, high-fidelity clickable mobile & desktop prototypes, component library.',
    unit: 'package',
    default_price: 65000,
    default_tax: 0,
  },
  {
    id: 'cat-4',
    title: 'WhatsApp Business API & Automated SMS Gateway',
    category: 'Integration',
    description: 'Instant notification triggers for order confirmation, dispatches, OTP, and status tracking.',
    unit: 'integration',
    default_price: 45000,
    default_tax: 0,
  },
  {
    id: 'cat-5',
    title: 'POS & Inventory Desktop / Cloud Software',
    category: 'Software Engineering',
    description: 'Real-time billing, thermal receipt printing, barcode scanner integration, and daily reports.',
    unit: 'module',
    default_price: 160000,
    default_tax: 0,
  },
  {
    id: 'cat-6',
    title: 'High-Performance Cloud Hosting & SLA Maintenance',
    category: 'Cloud & DevOps',
    description: 'SSL, automated daily backups, 99.9% uptime guarantee, and 24/7 technical monitoring.',
    unit: 'year',
    default_price: 48000,
    default_tax: 0,
  },
];

export function formatCurrency(amount: number, currency: CurrencyCode = 'LKR'): string {
  const sym = CURRENCY_SYMBOLS[currency] || (currency === 'LKR' ? 'Rs. ' : '$');
  return `${sym}${Number(amount || 0).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function numberToWords(amount: number, currency: CurrencyCode = 'LKR'): string {
  if (!amount || isNaN(amount) || amount === 0) {
    return `${currency === 'LKR' ? 'Sri Lankan Rupees' : currency} Zero Only`;
  }

  const units = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertChunk(num: number): string {
    let str = '';
    if (num >= 100) {
      str += units[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    if (num >= 20) {
      str += tens[Math.floor(num / 10)] + (num % 10 > 0 ? ' ' + units[num % 10] : '');
    } else if (num > 0) {
      str += units[num];
    }
    return str.trim();
  }

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  let words = '';
  const millions = Math.floor(integerPart / 1000000);
  const thousands = Math.floor((integerPart % 1000000) / 1000);
  const remainder = integerPart % 1000;

  if (millions > 0) {
    words += convertChunk(millions) + ' Million ';
  }
  if (thousands > 0) {
    words += convertChunk(thousands) + ' Thousand ';
  }
  if (remainder > 0) {
    words += convertChunk(remainder);
  }

  words = words.trim();
  if (!words) words = 'Zero';

  const prefix = currency === 'LKR' ? 'Sri Lankan Rupees' : currency;
  if (decimalPart > 0) {
    return `${prefix} ${words} and ${decimalPart}/100 Cents Only`;
  }
  return `${prefix} ${words} Only`;
}

export function calculateTotals(
  items: LineItem[],
  discountType: 'percentage' | 'fixed' = 'percentage',
  discountValue: number = 0,
  taxRate: number = 0,
  extraFee: number = 0
) {
  const subtotal = items.reduce((acc, item) => {
    const q = Number(item.quantity) || 0;
    const p = Number(item.unit_price) || 0;
    return acc + q * p;
  }, 0);

  const discountAmount =
    discountType === 'percentage'
      ? (subtotal * (Number(discountValue) || 0)) / 100
      : Math.min(subtotal, Number(discountValue) || 0);

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = (discountedSubtotal * (Number(taxRate) || 0)) / 100;
  const extra = Number(extraFee) || 0;
  const grandTotal = discountedSubtotal + taxAmount + extra;

  return {
    subtotal,
    discountAmount,
    discountedSubtotal,
    taxAmount,
    grandTotal,
  };
}
