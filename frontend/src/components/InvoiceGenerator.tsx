import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Receipt,
  Plus,
  Trash2,
  Printer,
  Copy,
  Check,
  Search,
  Filter,
  Eye,
  Edit3,
  DollarSign,
  Percent,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Share2,
  X,
  Layers,
  ArrowUpDown,
  FileCheck,
  ShieldCheck,
  Landmark,
  BadgePercent,
  CheckCheck,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';

export interface InvoiceItem {
  id: string;
  description: string;
  category?: string;
  scopeNotes?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface InvoiceDoc {
  id: string;
  docType: 'quotation' | 'invoice' | 'bill';
  docNumber: string;
  status: 'draft' | 'sent' | 'approved' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  currency: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientTaxNo?: string;
  items: InvoiceItem[];
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  taxRate: number;
  taxLabel: string;
  extraFee: number;
  extraFeeLabel: string;
  notes: string;
  paymentTerms: string;
  bankDetails: string;
  preparedBy: string;
  authorizedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceGeneratorProps {
  inquiries?: any[];
  onNotify?: (text: string, type?: 'success' | 'error') => void;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  LKR: 'Rs. ',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  AED: 'AED ',
  SGD: 'S$',
};

const DEFAULT_BANK_DETAILS = `Bank Name: Commercial Bank of Ceylon PLC
Account Name: VEXA IT SOLUTIONS (PVT) LTD
Account Number: 8009214782
Branch: Colombo Fort (Branch Code: 045)
SWIFT / BIC: CCEYLKLX
Currency: Sri Lankan Rupees (LKR)
Payment Reference: Please quote the Quotation or Invoice reference number`;

const DEFAULT_TERMS_QUOTATION = `1. Quotation Validity: This commercial quotation remains valid for 30 calendar days from the date of issue.
2. Payment Milestone Schedule:
   • 50% Advance deposit upon quotation acceptance and project sign-off to initiate development.
   • 25% Interim milestone payment upon Beta / UAT preview approval.
   • 25% Final settlement upon live production deployment, DNS handover, and source access.
3. Warranty & Support: Includes 60 days of complimentary post-deployment technical maintenance and bug fixes.
4. Intellectual Property: Full ownership and source code IP transfer to the client upon final settlement.`;

const DEFAULT_TERMS_INVOICE = `1. Payment Due: Payment is required within 14 calendar days from the date of invoice issue.
2. Settlement: Direct electronic bank transfer (CEFT / SLIPS) or online corporate payment gateway.
3. Official Receipt: An official digital acknowledgment will be generated immediately upon fund receipt.
4. Thank you for partnering with VEXA IT Solutions for your digital transformation!`;

// Number to Words in Sri Lankan Rupees
function numberToWordsLKR(amount: number): string {
  if (!amount || isNaN(amount) || amount === 0) return 'Sri Lankan Rupees Zero Only';

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

  if (decimalPart > 0) {
    return `Sri Lankan Rupees ${words} and ${decimalPart}/100 Cents Only`;
  }
  return `Sri Lankan Rupees ${words} Only`;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  inquiries = [],
  onNotify,
}) => {
  const { settings, pricingList } = useSite();

  // Documents state loaded from LocalStorage
  const [documents, setDocuments] = useState<InvoiceDoc[]>(() => {
    const saved = localStorage.getItem('vexa_billing_documents');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse billing documents from localStorage', e);
      }
    }

    // Default professional Sri Lankan enterprise sample documents in LKR
    const today = new Date().toISOString().split('T')[0];
    const dueDate30 = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const dueDate14 = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

    return [
      {
        id: 'doc-sample-1',
        docType: 'quotation',
        docNumber: 'VEXA-QUO-2026-001',
        status: 'sent',
        issueDate: today,
        dueDate: dueDate30,
        currency: 'LKR',
        clientName: 'Chaminda Rajapakse',
        clientCompany: 'Ceylinco Logistics & Maritime (Pvt) Ltd',
        clientEmail: 'chaminda@ceylincologistics.lk',
        clientPhone: '+94 77 345 8920',
        clientAddress: 'Level 12, World Trade Center, Echelon Square, Colombo 01, Sri Lanka',
        clientTaxNo: 'VAT-114892019-7000',
        items: [
          {
            id: 'item-1',
            description: 'Custom Corporate Web Application & Client Cargo Tracking Portal',
            category: 'Web Development',
            scopeNotes: 'Full-stack responsive web system, real-time shipment status, multi-role auth, and customer dashboard.',
            quantity: 1,
            unit: 'project',
            unitPrice: 185000,
          },
          {
            id: 'item-2',
            description: 'Executive UI/UX Interactive Design System & Brand Guidelines (Figma)',
            category: 'UI/UX Design',
            scopeNotes: 'Complete wireframes, interactive high-fidelity clickable prototype, mobile & desktop layouts.',
            quantity: 1,
            unit: 'package',
            unitPrice: 65000,
          },
          {
            id: 'item-3',
            description: 'Automated WhatsApp API & SMS Notification System',
            category: 'Software Integration',
            scopeNotes: 'Instant alert triggers for dispatch, milestone tracking, and dynamic PDF invoice generator.',
            quantity: 1,
            unit: 'integration',
            unitPrice: 45000,
          },
        ],
        discountType: 'percentage',
        discountValue: 10,
        taxRate: 0,
        taxLabel: 'VAT / SSCL',
        extraFee: 0,
        extraFeeLabel: 'Cloud Deployment Fee',
        notes: 'Includes complete source code repository, SSL certificate setup, and 60 days dedicated technical SLA.',
        paymentTerms: DEFAULT_TERMS_QUOTATION,
        bankDetails: DEFAULT_BANK_DETAILS,
        preparedBy: 'Nuwindu S. (Lead Architect)',
        authorizedBy: 'VEXA IT Management Board',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'doc-sample-2',
        docType: 'invoice',
        docNumber: 'VEXA-INV-2026-001',
        status: 'paid',
        issueDate: today,
        dueDate: dueDate14,
        currency: 'LKR',
        clientName: 'Dr. Rohan De Silva',
        clientCompany: 'Lanka HealthNet Solutions',
        clientEmail: 'rohan.desilva@lankahealth.lk',
        clientPhone: '+94 71 889 1234',
        clientAddress: 'No. 45, Horton Place, Colombo 07, Sri Lanka',
        clientTaxNo: 'TIN-109283741',
        items: [
          {
            id: 'item-10',
            description: 'Online Medical Appointment Booking & Doctor Portal Development',
            category: 'Healthcare Software',
            scopeNotes: 'Milestone 1: Backend architecture, database schema, doctor calendar, and patient SMS notifications.',
            quantity: 1,
            unit: 'milestone',
            unitPrice: 145000,
          },
          {
            id: 'item-11',
            description: 'Commercial Bank of Ceylon IPG (Internet Payment Gateway) Integration',
            category: 'FinTech',
            scopeNotes: 'Direct 3D-Secure 2.0 checkout, tokenization, transaction logging, and automated digital receipts.',
            quantity: 1,
            unit: 'module',
            unitPrice: 55000,
          },
        ],
        discountType: 'fixed',
        discountValue: 15000,
        taxRate: 0,
        taxLabel: 'VAT / SSCL',
        extraFee: 0,
        extraFeeLabel: 'Service Fee',
        notes: 'Milestone 1 payment cleared. Production environment activated on high-performance cloud server.',
        paymentTerms: DEFAULT_TERMS_INVOICE,
        bankDetails: DEFAULT_BANK_DETAILS,
        preparedBy: 'Operations & Accounts Team',
        authorizedBy: 'VEXA IT Management Board',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  });

  // Save documents to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('vexa_billing_documents', JSON.stringify(documents));
  }, [documents]);

  // Filtering and Searching
  const [searchQuery, setSearchQuery] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState<'all' | 'quotation' | 'invoice' | 'bill'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<InvoiceDoc | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Helper Toast
  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    if (onNotify) {
      onNotify(msg, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${msg}`);
    }
  };

  // Generate Unique Document Number
  const generateDocNumber = (type: 'quotation' | 'invoice' | 'bill') => {
    const prefix = type === 'quotation' ? 'VEXA-QUO' : type === 'invoice' ? 'VEXA-INV' : 'VEXA-BILL';
    const year = new Date().getFullYear();
    const count = documents.filter((d) => d.docType === type).length + 1;
    const serial = String(count).padStart(3, '0');
    return `${prefix}-${year}-${serial}`;
  };

  // Editor Form State (Defaulting to professional LKR)
  const initialFormState: InvoiceDoc = {
    id: '',
    docType: 'quotation',
    docNumber: '',
    status: 'draft',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    currency: 'LKR',
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientTaxNo: '',
    items: [
      {
        id: 'item-' + Date.now(),
        description: 'Corporate Web Application & High-Performance UI Development',
        category: 'Web Development',
        scopeNotes: 'Custom design, mobile optimization, SEO foundations, fast cloud hosting setup.',
        quantity: 1,
        unit: 'project',
        unitPrice: 85000,
      },
    ],
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 0,
    taxLabel: 'VAT / SSCL',
    extraFee: 0,
    extraFeeLabel: 'Hosting & Domain Setup',
    notes: 'Includes dedicated account manager, free technical training, and 60-day post-launch warranty.',
    paymentTerms: DEFAULT_TERMS_QUOTATION,
    bankDetails: DEFAULT_BANK_DETAILS,
    preparedBy: 'VEXA IT Engineering Team',
    authorizedBy: 'Director of Technology',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [formData, setFormData] = useState<InvoiceDoc>(initialFormState);

  // Open Create Modal
  const handleOpenCreate = (type: 'quotation' | 'invoice' | 'bill' = 'quotation') => {
    const newDocNum = generateDocNumber(type);
    const isQuo = type === 'quotation';
    setFormData({
      ...initialFormState,
      id: 'doc-' + Date.now(),
      docType: type,
      docNumber: newDocNum,
      paymentTerms: isQuo ? DEFAULT_TERMS_QUOTATION : DEFAULT_TERMS_INVOICE,
      dueDate: isQuo
        ? new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
        : new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: [
        {
          id: 'item-' + Date.now(),
          description: isQuo
            ? 'Custom Enterprise Web Portal & Digital Architecture'
            : 'Delivered Software Engineering & Cloud Deployment Services',
          category: 'Software Engineering',
          scopeNotes: 'Full implementation, security audit, user documentation, and deployment.',
          quantity: 1,
          unit: 'project',
          unitPrice: isQuo ? 120000 : 75000,
        },
      ],
    });
    setIsEditorOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (doc: InvoiceDoc) => {
    setFormData({ ...doc });
    setIsEditorOpen(true);
  };

  // Open Preview Modal
  const handleOpenPreview = (doc: InvoiceDoc) => {
    setActiveDoc(doc);
    setIsPreviewOpen(true);
  };

  // Duplicate Document
  const handleDuplicate = (doc: InvoiceDoc) => {
    const newType = doc.docType;
    const newNum = generateDocNumber(newType);
    const duplicated: InvoiceDoc = {
      ...doc,
      id: 'doc-' + Date.now(),
      docNumber: newNum,
      status: 'draft',
      issueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDocuments((prev) => [duplicated, ...prev]);
    notify(`Created copy: ${newNum}`);
  };

  // Convert Quote to Invoice
  const handleConvertToInvoice = (quote: InvoiceDoc) => {
    const newNum = generateDocNumber('invoice');
    const converted: InvoiceDoc = {
      ...quote,
      id: 'doc-' + Date.now(),
      docType: 'invoice',
      docNumber: newNum,
      status: 'sent',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      paymentTerms: DEFAULT_TERMS_INVOICE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDocuments((prev) => [converted, ...prev]);
    notify(`Converted ${quote.docNumber} to Invoice ${newNum}`);
  };

  // Delete Document
  const handleDelete = (id: string, num: string) => {
    if (!window.confirm(`Are you sure you want to delete ${num}?`)) return;
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    notify(`Deleted ${num}`);
  };

  // Update Status directly
  const handleStatusChange = (id: string, newStatus: InvoiceDoc['status']) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus, updatedAt: new Date().toISOString() } : d))
    );
    notify(`Status updated to ${newStatus.toUpperCase()}`);
  };

  // Import Client from Leads
  const handleImportLead = (leadId: string) => {
    const lead = inquiries.find((i) => i._id === leadId || i.id === leadId);
    if (!lead) return;
    setFormData((prev) => ({
      ...prev,
      clientName: lead.name || prev.clientName,
      clientEmail: lead.email || prev.clientEmail,
      clientPhone: lead.phone || prev.clientPhone,
      clientCompany: lead.company || prev.clientCompany,
      notes: lead.details ? `Client Requirements: ${lead.details}` : prev.notes,
    }));
    notify(`Imported lead: ${lead.name}`);
  };

  // Line Item Management in Form
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: 'item-' + Date.now(),
          description: '',
          category: 'Web Development',
          scopeNotes: '',
          quantity: 1,
          unit: 'unit',
          unitPrice: 0,
        },
      ],
    }));
  };

  const handleUpdateItem = (itemId: string, field: keyof InvoiceItem, val: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === itemId ? { ...it, [field]: val } : it)),
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    if (formData.items.length <= 1) {
      notify('Must have at least one line item', 'error');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== itemId),
    }));
  };

  // Insert from Pricing Catalog (Extracting numerical LKR price)
  const handleInsertPricingPackage = (serviceName: string, pkgName: string, priceStr: string) => {
    const numPrice = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: 'item-' + Date.now(),
          description: `${serviceName} — ${pkgName} Package`,
          category: serviceName,
          scopeNotes: `Full implementation based on ${serviceName} catalog specifications.`,
          quantity: 1,
          unit: 'package',
          unitPrice: numPrice,
        },
      ],
    }));
    notify(`Added ${pkgName} (Rs. ${numPrice.toLocaleString()}) to items`);
  };

  // Format Currency string
  const formatPrice = (amount: number, currency: string = 'LKR') => {
    const sym = CURRENCY_SYMBOLS[currency] || (currency === 'LKR' ? 'Rs. ' : '$');
    return `${sym}${Number(amount || 0).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Form Calculations
  const calculateTotals = (doc: InvoiceDoc) => {
    const subtotal = doc.items.reduce((acc, item) => {
      const q = Number(item.quantity) || 0;
      const p = Number(item.unitPrice) || 0;
      return acc + q * p;
    }, 0);

    const discountValue = Number(doc.discountValue) || 0;
    const discountAmount =
      doc.discountType === 'percentage'
        ? (subtotal * discountValue) / 100
        : Math.min(subtotal, discountValue);

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const taxRate = Number(doc.taxRate) || 0;
    const taxAmount = (discountedSubtotal * taxRate) / 100;
    const extraFee = Number(doc.extraFee) || 0;
    const grandTotal = discountedSubtotal + taxAmount + extraFee;

    return {
      subtotal,
      discountAmount,
      discountedSubtotal,
      taxAmount,
      grandTotal,
    };
  };

  // Save Document from Editor
  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.docNumber.trim()) {
      notify('Document Number is required', 'error');
      return;
    }
    if (!formData.clientName.trim()) {
      notify('Client Name is required', 'error');
      return;
    }
    if (formData.items.length === 0) {
      notify('At least one item is required', 'error');
      return;
    }

    const exists = documents.some((d) => d.id === formData.id);
    const updatedDoc: InvoiceDoc = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    if (exists) {
      setDocuments((prev) => prev.map((d) => (d.id === formData.id ? updatedDoc : d)));
      notify(`Updated ${formData.docNumber}`);
    } else {
      setDocuments((prev) => [updatedDoc, ...prev]);
      notify(`Created ${formData.docNumber}`);
    }

    setIsEditorOpen(false);
  };

  // Save & Open Preview
  const handleSaveAndPreview = (e: React.FormEvent) => {
    handleSaveDoc(e);
    setActiveDoc(formData);
    setIsPreviewOpen(true);
  };

  // Filtered list
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.clientCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = docTypeFilter === 'all' || doc.docType === docTypeFilter;
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [documents, searchQuery, docTypeFilter, statusFilter]);

  // Summary Metrics (All in LKR standard)
  const metrics = useMemo(() => {
    let totalQuotesValue = 0;
    let quotesCount = 0;
    let totalInvoicesValue = 0;
    let paidInvoicesValue = 0;
    let pendingInvoicesValue = 0;

    documents.forEach((d) => {
      const { grandTotal } = calculateTotals(d);
      if (d.docType === 'quotation') {
        quotesCount++;
        totalQuotesValue += grandTotal;
      } else {
        totalInvoicesValue += grandTotal;
        if (d.status === 'paid') {
          paidInvoicesValue += grandTotal;
        } else if (d.status !== 'cancelled') {
          pendingInvoicesValue += grandTotal;
        }
      }
    });

    return {
      quotesCount,
      totalQuotesValue,
      totalInvoicesValue,
      paidInvoicesValue,
      pendingInvoicesValue,
      totalDocs: documents.length,
    };
  }, [documents]);

  // Copy Email / WhatsApp Summary in LKR
  const handleCopySummaryText = (doc: InvoiceDoc) => {
    const { subtotal, discountAmount, taxAmount, grandTotal } = calculateTotals(doc);
    const isQuo = doc.docType === 'quotation';

    let text = `=========================================\n`;
    text += `  ${isQuo ? 'OFFICIAL COMMERCIAL QUOTATION' : 'OFFICIAL TAX INVOICE'}\n`;
    text += `  Ref No: ${doc.docNumber}\n`;
    text += `=========================================\n\n`;
    text += `🏢 ISSUER: ${settings?.name || 'VEXA IT SOLUTIONS (PVT) LTD'}\n`;
    text += `📍 Colombo, Sri Lanka | 📞 ${settings?.phone || '+94 71 269 6668'}\n`;
    text += `✉️ ${settings?.email || 'vexa.it2026@gmail.com'}\n\n`;
    text += `👤 CLIENT: ${doc.clientName}\n`;
    if (doc.clientCompany) text += `🏢 Company: ${doc.clientCompany}\n`;
    if (doc.clientAddress) text += `📍 Address: ${doc.clientAddress}\n`;
    text += `📅 Issue Date: ${doc.issueDate} | Due: ${doc.dueDate}\n\n`;
    text += `-----------------------------------------\n`;
    text += `📦 ITEMIZED SCOPE OF SERVICES:\n`;
    text += `-----------------------------------------\n`;
    doc.items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.description}\n`;
      if (item.scopeNotes) text += `   • Scope: ${item.scopeNotes}\n`;
      text += `   • Qty: ${item.quantity} ${item.unit} @ ${formatPrice(item.unitPrice, doc.currency)} = ${formatPrice(item.quantity * item.unitPrice, doc.currency)}\n\n`;
    });
    text += `-----------------------------------------\n`;
    text += `💰 Subtotal: ${formatPrice(subtotal, doc.currency)}\n`;
    if (discountAmount > 0) {
      text += `🏷️ Discount (${doc.discountType === 'percentage' ? `${doc.discountValue}%` : 'Special Fixed'}): -${formatPrice(discountAmount, doc.currency)}\n`;
    }
    if (taxAmount > 0) {
      text += `🏛️ Tax (${doc.taxLabel || 'VAT'} ${doc.taxRate}%): +${formatPrice(taxAmount, doc.currency)}\n`;
    }
    if (doc.extraFee > 0) {
      text += `➕ ${doc.extraFeeLabel || 'Extra Fee'}: +${formatPrice(doc.extraFee, doc.currency)}\n`;
    }
    text += `\n⭐️ GRAND TOTAL: ${formatPrice(grandTotal, doc.currency)} (${doc.currency})\n`;
    text += `📝 In Words: ${numberToWordsLKR(grandTotal)}\n\n`;
    text += `-----------------------------------------\n`;
    text += `🏦 BANK & SETTLEMENT DETAILS:\n`;
    text += `-----------------------------------------\n`;
    text += `${doc.bankDetails}\n\n`;
    text += `-----------------------------------------\n`;
    text += `📌 TERMS & CONDITIONS:\n`;
    text += `-----------------------------------------\n`;
    text += `${doc.paymentTerms}\n\n`;
    text += `Authorized by: ${doc.authorizedBy || 'VEXA IT Management'}\n`;

    navigator.clipboard.writeText(text);
    setCopiedId(doc.id);
    notify(`Copied ${doc.docNumber} summary in LKR to clipboard`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Trigger Print View
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Cards in LKR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Quotations (LKR)</p>
            <p className="text-xl sm:text-2xl font-black text-white mt-1">
              {formatPrice(metrics.totalQuotesValue, 'LKR')}
            </p>
            <p className="text-[11px] text-blue-400 mt-0.5">{metrics.quotesCount} active proposals</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settled / Paid (LKR)</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              {formatPrice(metrics.paidInvoicesValue, 'LKR')}
            </p>
            <p className="text-[11px] text-emerald-500 mt-0.5">Cleared revenue</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Invoices (LKR)</p>
            <p className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              {formatPrice(metrics.pendingInvoicesValue, 'LKR')}
            </p>
            <p className="text-[11px] text-amber-500 mt-0.5">Awaiting bank settlement</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Documents</p>
            <p className="text-xl sm:text-2xl font-black text-white mt-1">{metrics.totalDocs}</p>
            <p className="text-[11px] text-indigo-400 mt-0.5">Quotes, Invoices & Bills</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar: Actions & Filters */}
      <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search & Type Select */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by quote #, invoice #, client, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Doc Type Filter */}
          <div className="flex bg-slate-800/80 border border-slate-700/80 rounded-xl p-1">
            <button
              onClick={() => setDocTypeFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                docTypeFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDocTypeFilter('quotation')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                docTypeFilter === 'quotation' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Quotations
            </button>
            <button
              onClick={() => setDocTypeFilter('invoice')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                docTypeFilter === 'invoice' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Invoices
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Create Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenCreate('quotation')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>New Quotation (LKR)</span>
          </button>
          <button
            onClick={() => handleOpenCreate('invoice')}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>New Tax Invoice (LKR)</span>
          </button>
        </div>
      </div>

      {/* Document History Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Doc # & Classification</th>
                <th className="py-3.5 px-4">Client & Organization</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4">Scope & Items</th>
                <th className="py-3.5 px-4">Total (LKR)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">No quotations or bills found</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Click "New Quotation" or "New Tax Invoice" to create one in LKR</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const { discountAmount, grandTotal } = calculateTotals(doc);
                  const isQuo = doc.docType === 'quotation';

                  return (
                    <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Doc # and Type */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span className="font-mono">{doc.docNumber}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isQuo
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {isQuo ? 'Quotation' : 'Tax Invoice'}
                          </span>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{doc.clientName}</div>
                        {doc.clientCompany && <div className="text-[11px] text-slate-400">{doc.clientCompany}</div>}
                        {doc.clientEmail && <div className="text-[10px] text-slate-500">{doc.clientEmail}</div>}
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-300">
                          <span className="text-slate-500">Issued:</span> {doc.issueDate}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          <span className="text-slate-500">Due:</span> {doc.dueDate}
                        </div>
                      </td>

                      {/* Items & Discount info */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-300">
                          {doc.items.length} {doc.items.length === 1 ? 'line item' : 'line items'}
                        </div>
                        {discountAmount > 0 ? (
                          <div className="text-[10px] text-amber-400 mt-0.5 flex items-center gap-1">
                            <Percent className="w-3 h-3" />
                            <span>
                              {doc.discountType === 'percentage'
                                ? `${doc.discountValue}% OFF`
                                : `${formatPrice(doc.discountValue, doc.currency)} OFF`}
                            </span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 mt-0.5">No discount</div>
                        )}
                      </td>

                      {/* Grand Total */}
                      <td className="py-3.5 px-4">
                        <div className="text-sm font-black text-white font-mono">
                          {formatPrice(grandTotal, doc.currency)}
                        </div>
                        <div className="text-[10px] text-blue-400 uppercase font-bold">{doc.currency}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={doc.status}
                          onChange={(e) => handleStatusChange(doc.id, e.target.value as any)}
                          className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border cursor-pointer focus:outline-none ${
                            doc.status === 'paid' || doc.status === 'approved'
                              ? 'bg-emerald-950/60 border-emerald-700/80 text-emerald-300'
                              : doc.status === 'sent'
                              ? 'bg-blue-950/60 border-blue-700/80 text-blue-300'
                              : doc.status === 'overdue'
                              ? 'bg-rose-950/60 border-rose-700/80 text-rose-300'
                              : doc.status === 'cancelled'
                              ? 'bg-slate-800 border-slate-700 text-slate-400'
                              : 'bg-amber-950/60 border-amber-700/80 text-amber-300'
                          }`}
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="approved">Approved</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview & Print */}
                          <button
                            onClick={() => handleOpenPreview(doc)}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors cursor-pointer"
                            title="Preview & Print Professional PDF"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Edit */}
                          <button
                            onClick={() => handleOpenEdit(doc)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                            title="Edit Document"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Copy Summary */}
                          <button
                            onClick={() => handleCopySummaryText(doc)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                            title="Copy Summary Text for Email/WhatsApp"
                          >
                            {copiedId === doc.id ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* Convert Quote to Invoice */}
                          {isQuo && (
                            <button
                              onClick={() => handleConvertToInvoice(doc)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                              title="Convert to Tax Invoice"
                            >
                              <Receipt className="w-4 h-4" />
                            </button>
                          )}

                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicate(doc)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                            title="Duplicate Document"
                          >
                            <Layers className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(doc.id, doc.docNumber)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: DOCUMENT EDITOR (CREATE & EDIT IN LKR)
         ========================================================================= */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl my-6 overflow-hidden animate-scaleUp">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  {formData.docType === 'quotation' ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <Receipt className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {formData.id && documents.some((d) => d.id === formData.id)
                      ? `Edit ${formData.docNumber}`
                      : `Create Professional ${formData.docType === 'quotation' ? 'Quotation' : 'Tax Invoice / Bill'} (LKR)`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Set up itemized scope, custom Sri Lankan Rupee pricing, discounts, and payment terms
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveDoc} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-thin">
              {/* Document Classification Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Document Type</label>
                  <select
                    value={formData.docType}
                    onChange={(e) => {
                      const newType = e.target.value as any;
                      setFormData({
                        ...formData,
                        docType: newType,
                        docNumber: generateDocNumber(newType),
                        paymentTerms: newType === 'quotation' ? DEFAULT_TERMS_QUOTATION : DEFAULT_TERMS_INVOICE,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white cursor-pointer"
                  >
                    <option value="quotation">Commercial Quotation</option>
                    <option value="invoice">Official Tax Invoice</option>
                    <option value="bill">Commercial Bill / Receipt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Document Number</label>
                  <input
                    type="text"
                    required
                    value={formData.docNumber}
                    onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white cursor-pointer font-bold text-blue-400"
                  >
                    <option value="LKR">LKR (Rs.) — Sri Lankan Rupee</option>
                    <option value="USD">USD ($) — US Dollar</option>
                    <option value="EUR">EUR (€) — Euro</option>
                    <option value="GBP">GBP (£) — British Pound</option>
                    <option value="AUD">AUD (A$) — Australian Dollar</option>
                    <option value="CAD">CAD (C$) — Canadian Dollar</option>
                    <option value="AED">AED — UAE Dirham</option>
                    <option value="SGD">SGD (S$) — Singapore Dollar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white cursor-pointer font-semibold"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent to Client</option>
                    <option value="approved">Approved</option>
                    <option value="paid">Paid & Settled</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Client Details + Quick Import */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>Client & Organization Details</span>
                  </h4>
                  {inquiries.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Quick Fill from Leads:</span>
                      <select
                        onChange={(e) => e.target.value && handleImportLead(e.target.value)}
                        className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-blue-300 cursor-pointer"
                      >
                        <option value="">Select an Inquiry...</option>
                        {inquiries.map((inq) => (
                          <option key={inq._id || inq.id} value={inq._id || inq.id}>
                            {inq.name} {inq.company ? `(${inq.company})` : ''} - {inq.service || 'Lead'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Client Full Name / Attention <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mr. Chaminda Rajapakse"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Ceylinco Logistics & Maritime (Pvt) Ltd"
                      value={formData.clientCompany}
                      onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Client Tax / VAT / TIN No.</label>
                    <input
                      type="text"
                      placeholder="e.g. VAT-114892019-7000"
                      value={formData.clientTaxNo || ''}
                      onChange={(e) => setFormData({ ...formData, clientTaxNo: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="contact@company.lk"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+94 77 123 4567"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Billing Address & City</label>
                    <input
                      type="text"
                      placeholder="Level 12, World Trade Center, Colombo 01"
                      value={formData.clientAddress}
                      onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dates Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Issue Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{formData.docType === 'quotation' ? 'Proposal Valid Until (30 Days)' : 'Payment Settlement Due Date'}</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              {/* Line Items Section */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Itemized Services, Scope & Deliverables ({formData.currency})</span>
                  </h4>

                  {/* Catalog Quick Insert Dropdown */}
                  {pricingList && pricingList.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Quick Package:</span>
                      <select
                        onChange={(e) => {
                          if (!e.target.value) return;
                          const [sName, pName, price] = e.target.value.split('|');
                          handleInsertPricingPackage(sName, pName, price);
                          e.target.value = '';
                        }}
                        className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-indigo-300 cursor-pointer"
                      >
                        <option value="">Insert from VEXA IT Catalog...</option>
                        {pricingList.map((svc) => (
                          <optgroup key={svc.id} label={svc.serviceTitle}>
                            {svc.packages.map((pkg) => (
                              <option
                                key={pkg.id}
                                value={`${svc.serviceTitle}|${pkg.name}|${pkg.price}`}
                              >
                                {pkg.name} ({pkg.price})
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {formData.items.map((item, index) => {
                    const rowTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                          {/* Item Description */}
                          <div className="sm:col-span-6">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                              Item #{index + 1} — Service / Module Name
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Enterprise Full-Stack Web Portal"
                              value={item.description}
                              onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-semibold"
                            />
                          </div>

                          {/* Quantity & Unit */}
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Qty / Unit</label>
                            <div className="flex gap-1">
                              <input
                                type="number"
                                min="1"
                                step="0.5"
                                required
                                value={item.quantity}
                                onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                                className="w-16 px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white text-center font-bold"
                              />
                              <input
                                type="text"
                                placeholder="unit"
                                value={item.unit}
                                onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                                className="w-full px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                              />
                            </div>
                          </div>

                          {/* Unit Price in LKR */}
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                              Unit Price ({formData.currency})
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              required
                              placeholder="0.00"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                              }
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-bold text-right font-mono"
                            />
                          </div>

                          {/* Calculated Row Total & Delete */}
                          <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                            <div className="text-right">
                              <div className="text-[10px] text-slate-500 uppercase font-bold">Line Total</div>
                              <div className="text-xs font-black text-white font-mono">
                                {formatPrice(rowTotal, formData.currency)}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Remove Line Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Optional Scope Notes / Deliverables Description */}
                        <div>
                          <input
                            type="text"
                            placeholder="Deliverables scope / technical details (e.g. Responsive design, API integration, multi-language support, automated backups)..."
                            value={item.scopeNotes || ''}
                            onChange={(e) => handleUpdateItem(item.id, 'scopeNotes', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-[11px] text-slate-300 placeholder-slate-600 italic"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-2.5 bg-slate-800/60 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-blue-400" />
                  <span>Add Custom Scope / Line Item (LKR)</span>
                </button>
              </div>

              {/* Discounts, Tax & Financial Summary Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                {/* Adjustments: Discount, Tax %, Extra fees */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <BadgePercent className="w-4 h-4 text-amber-400" />
                    <span>Commercial Discounts & Taxes</span>
                  </h4>

                  {/* Discount controls */}
                  <div className="p-3 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Discount Mode</label>
                      <div className="flex bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, discountType: 'percentage' })}
                          className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                            formData.discountType === 'percentage'
                              ? 'bg-amber-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Percentage (%)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, discountType: 'fixed' })}
                          className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                            formData.discountType === 'fixed'
                              ? 'bg-amber-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Fixed Amount ({formData.currency})
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max={formData.discountType === 'percentage' ? 100 : undefined}
                        step="any"
                        placeholder="Discount value"
                        value={formData.discountValue}
                        onChange={(e) =>
                          setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-bold font-mono"
                      />
                      <span className="text-xs text-amber-400 font-bold whitespace-nowrap">
                        {formData.discountType === 'percentage' ? '% OFF' : formData.currency}
                      </span>
                    </div>
                  </div>

                  {/* Tax & Extra Fees */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Tax / VAT / SSCL (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        placeholder="0"
                        value={formData.taxRate}
                        onChange={(e) =>
                          setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Extra Surcharge ({formData.currency})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={formData.extraFee}
                        onChange={(e) =>
                          setFormData({ ...formData, extraFee: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white font-bold font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Calculated Totals Card in LKR */}
                {(() => {
                  const { subtotal, discountAmount, discountedSubtotal, taxAmount, grandTotal } =
                    calculateTotals(formData);

                  return (
                    <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Financial Summary ({formData.currency})
                      </h4>

                      <div className="space-y-2 text-xs divide-y divide-slate-800/80">
                        <div className="flex justify-between text-slate-300 pt-1">
                          <span>Items Subtotal:</span>
                          <span className="font-mono font-bold">
                            {formatPrice(subtotal, formData.currency)}
                          </span>
                        </div>

                        {discountAmount > 0 && (
                          <div className="flex justify-between text-amber-400 pt-1 font-semibold">
                            <span>
                              Discount (
                              {formData.discountType === 'percentage'
                                ? `${formData.discountValue}%`
                                : formatPrice(formData.discountValue, formData.currency)}
                              ):
                            </span>
                            <span className="font-mono">-{formatPrice(discountAmount, formData.currency)}</span>
                          </div>
                        )}

                        {taxAmount > 0 && (
                          <div className="flex justify-between text-slate-300 pt-1">
                            <span>Tax / VAT ({formData.taxRate}%):</span>
                            <span className="font-mono font-bold">+{formatPrice(taxAmount, formData.currency)}</span>
                          </div>
                        )}

                        {Number(formData.extraFee) > 0 && (
                          <div className="flex justify-between text-slate-300 pt-1">
                            <span>{formData.extraFeeLabel || 'Extra Charge'}:</span>
                            <span className="font-mono font-bold">+{formatPrice(formData.extraFee, formData.currency)}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-white pt-3 border-t-2 border-slate-700">
                          <span className="text-sm font-black uppercase">Net Total (LKR):</span>
                          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 font-mono">
                            {formatPrice(grandTotal, formData.currency)}
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded-lg italic">
                        Amount in words: <span className="text-slate-200 font-medium">{numberToWordsLKR(grandTotal)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Payment Details & Terms (Collapsible/Editable) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-blue-400" />
                    <span>Sri Lankan Banking & Wire Transfer Details</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.bankDetails}
                    onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Terms, Conditions & Payment Milestones</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 leading-relaxed"
                  />
                </div>
              </div>

              {/* Authorizations Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Prepared By</label>
                  <input
                    type="text"
                    value={formData.preparedBy}
                    onChange={(e) => setFormData({ ...formData, preparedBy: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Authorized By</label>
                  <input
                    type="text"
                    value={formData.authorizedBy}
                    onChange={(e) => setFormData({ ...formData, authorizedBy: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAndPreview}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 hover:text-blue-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Save & Preview Corporate PDF</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Document</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: PRINT-READY CORPORATE A4 PREVIEW & PDF EXPORTER MODAL
         ========================================================================= */}
      {isPreviewOpen && activeDoc && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl my-4 overflow-hidden flex flex-col max-h-[95vh]">
            {/* Top Toolbar (Hidden on print) */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0 print:hidden">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="font-mono">{activeDoc.docNumber}</span>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                      {activeDoc.docType === 'quotation' ? 'Quotation (LKR)' : 'Tax Invoice (LKR)'}
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopySummaryText(activeDoc)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                  title="Copy formatted summary in LKR for WhatsApp or Email"
                >
                  {copiedId === activeDoc.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy WhatsApp / Email</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>

                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Printable Document Container */}
            <div className="p-4 sm:p-8 overflow-y-auto bg-slate-950 flex justify-center scrollbar-thin">
              {/* The Actual Corporate Branded Document Sheet */}
              <div
                id="printable-document"
                className="w-full max-w-3xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 space-y-7 font-sans print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none"
              >
                {/* Top Header: Company Logo & Document Classification */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-900 pb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-700 flex items-center justify-center font-black text-white text-xl shadow-md">
                        V
                      </div>
                      <div>
                        <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                          {settings?.name || 'VEXA IT SOLUTIONS (PVT) LTD'}
                        </h1>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                          Next-Gen Software Engineering & Digital Architecture
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-slate-600 space-y-0.5">
                      <p className="font-semibold text-slate-700">
                        {settings?.location || 'Colombo, Sri Lanka'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">Official Email:</span> {settings?.email || 'vexa.it2026@gmail.com'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">Hotline:</span> {settings?.phone || '+94 71 269 6668'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">Web Portal:</span> https://vexait.com
                      </p>
                      <p className="text-[10px] text-slate-500 pt-0.5">
                        Company Reg: PV 00298415 | SVAT: 114592019-7000
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="inline-block bg-slate-950 text-white px-4 py-1.5 rounded-lg mb-2">
                      <h2 className="text-xl font-black uppercase tracking-wider">
                        {activeDoc.docType === 'quotation'
                          ? 'COMMERCIAL QUOTATION'
                          : activeDoc.docType === 'invoice'
                          ? 'OFFICIAL TAX INVOICE'
                          : 'COMMERCIAL RECEIPT'}
                      </h2>
                    </div>

                    <p className="text-base font-mono font-black text-blue-700 mt-1">
                      {activeDoc.docNumber}
                    </p>

                    <div className="mt-3 text-xs space-y-1">
                      <div className="flex sm:justify-end gap-2 text-slate-600">
                        <span className="font-bold text-slate-900">Issue Date:</span>
                        <span className="font-medium">{activeDoc.issueDate}</span>
                      </div>
                      <div className="flex sm:justify-end gap-2 text-slate-600">
                        <span className="font-bold text-slate-900">
                          {activeDoc.docType === 'quotation' ? 'Validity Period:' : 'Payment Due Date:'}
                        </span>
                        <span className="font-medium">{activeDoc.dueDate}</span>
                      </div>
                      <div className="flex sm:justify-end gap-2 text-slate-600">
                        <span className="font-bold text-slate-900">Currency:</span>
                        <span className="font-bold text-slate-950">Sri Lankan Rupees (LKR)</span>
                      </div>
                      <div className="flex sm:justify-end gap-2 text-slate-600 pt-1">
                        <span className="font-bold text-slate-900">Status:</span>
                        <span
                          className={`uppercase font-black px-2 py-0.5 rounded text-[10px] ${
                            activeDoc.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : activeDoc.status === 'approved'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {activeDoc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Bill To Block */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      CLIENT / BILLED TO
                    </h3>
                    <p className="text-base font-black text-slate-950">{activeDoc.clientName}</p>
                    {activeDoc.clientCompany && (
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{activeDoc.clientCompany}</p>
                    )}
                    {activeDoc.clientAddress && (
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{activeDoc.clientAddress}</p>
                    )}
                    {activeDoc.clientTaxNo && (
                      <p className="text-[11px] font-mono text-slate-600 mt-1">
                        <span className="font-bold">Tax/VAT No:</span> {activeDoc.clientTaxNo}
                      </p>
                    )}
                  </div>

                  <div className="sm:text-right text-xs text-slate-600 space-y-1 flex flex-col sm:items-end justify-center">
                    {activeDoc.clientEmail && (
                      <p>
                        <span className="font-semibold text-slate-700">Email:</span> {activeDoc.clientEmail}
                      </p>
                    )}
                    {activeDoc.clientPhone && (
                      <p>
                        <span className="font-semibold text-slate-700">Phone:</span> {activeDoc.clientPhone}
                      </p>
                    )}
                    <p className="text-[11px] font-semibold text-slate-500">
                      Prepared by: {activeDoc.preparedBy || 'VEXA IT Engineering'}
                    </p>
                  </div>
                </div>

                {/* Itemized Table in LKR */}
                <div className="overflow-hidden border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                        <th className="py-3 px-3 text-center w-12">#</th>
                        <th className="py-3 px-3">Service & Scope of Deliverables</th>
                        <th className="py-3 px-3 text-center w-24">Qty / Unit</th>
                        <th className="py-3 px-3 text-right w-32">Unit Price (LKR)</th>
                        <th className="py-3 px-3 text-right w-36">Total (LKR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                      {activeDoc.items.map((item, index) => {
                        const rowTotal = item.quantity * item.unitPrice;
                        return (
                          <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                            <td className="py-3 px-3 font-mono text-slate-400 text-center font-bold">{index + 1}</td>
                            <td className="py-3 px-3">
                              <p className="font-black text-slate-950 text-xs">{item.description}</p>
                              {item.scopeNotes && (
                                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.scopeNotes}</p>
                              )}
                              {item.category && (
                                <span className="inline-block text-[9px] font-bold uppercase bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded mt-1">
                                  {item.category}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center font-semibold text-slate-700">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-slate-800">
                              {formatPrice(item.unitPrice, activeDoc.currency)}
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-black text-slate-950">
                              {formatPrice(rowTotal, activeDoc.currency)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Totals & Notes Section in LKR */}
                {(() => {
                  const { subtotal, discountAmount, taxAmount, grandTotal } = calculateTotals(activeDoc);

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
                      {/* Left: Notes & Bank Details */}
                      <div className="space-y-3.5 text-xs text-slate-600">
                        {activeDoc.notes && (
                          <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-xl">
                            <h4 className="font-bold text-blue-900 text-[11px] uppercase tracking-wider mb-0.5">
                              Scope & Client Notes:
                            </h4>
                            <p className="text-slate-700 leading-relaxed text-[11px]">{activeDoc.notes}</p>
                          </div>
                        )}

                        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                          <h4 className="font-black text-slate-950 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5 text-blue-700" />
                            <span>Sri Lankan Bank Settlement Details:</span>
                          </h4>
                          <pre className="font-sans text-[11px] whitespace-pre-line text-slate-800 font-medium leading-relaxed">
                            {activeDoc.bankDetails}
                          </pre>
                        </div>
                      </div>

                      {/* Right: Calculations */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-700 py-1.5 border-b border-slate-200">
                          <span className="font-semibold">Subtotal:</span>
                          <span className="font-mono font-bold text-slate-950">
                            {formatPrice(subtotal, activeDoc.currency)}
                          </span>
                        </div>

                        {discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-700 py-1.5 border-b border-slate-200 font-semibold bg-emerald-50 px-2 rounded">
                            <span>
                              Commercial Discount (
                              {activeDoc.discountType === 'percentage'
                                ? `${activeDoc.discountValue}%`
                                : formatPrice(activeDoc.discountValue, activeDoc.currency)}
                              ):
                            </span>
                            <span className="font-mono font-bold">-{formatPrice(discountAmount, activeDoc.currency)}</span>
                          </div>
                        )}

                        {taxAmount > 0 && (
                          <div className="flex justify-between text-slate-700 py-1.5 border-b border-slate-200">
                            <span className="font-semibold">{activeDoc.taxLabel || 'VAT'} ({activeDoc.taxRate}%):</span>
                            <span className="font-mono font-bold text-slate-950">
                              +{formatPrice(taxAmount, activeDoc.currency)}
                            </span>
                          </div>
                        )}

                        {Number(activeDoc.extraFee) > 0 && (
                          <div className="flex justify-between text-slate-700 py-1.5 border-b border-slate-200">
                            <span className="font-semibold">{activeDoc.extraFeeLabel || 'Hosting & Setup'}:</span>
                            <span className="font-mono font-bold text-slate-950">
                              +{formatPrice(activeDoc.extraFee, activeDoc.currency)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center p-3 bg-slate-900 text-white rounded-xl shadow-md mt-2">
                          <span className="text-sm font-black uppercase tracking-wider">Net Amount (LKR):</span>
                          <span className="text-xl font-black text-amber-300 font-mono">
                            {formatPrice(grandTotal, activeDoc.currency)}
                          </span>
                        </div>

                        <div className="pt-2 text-[11px] text-slate-600 italic">
                          <span className="font-bold text-slate-900 not-italic">Amount in Words: </span>
                          {numberToWordsLKR(grandTotal)}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Terms and Signatures Section */}
                <div className="pt-4 border-t-2 border-slate-200 space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Terms of Service, Milestones & Guarantee
                    </h4>
                    <p className="text-[11px] text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {activeDoc.paymentTerms}
                    </p>
                  </div>

                  {/* Dual Signature Block: VEXA IT Signatory & Client Acceptance */}
                  <div className="grid grid-cols-2 gap-8 pt-4">
                    {/* Authorized Signatory */}
                    <div>
                      <div className="h-14 border-b border-slate-400 flex items-end pb-1">
                        <span className="text-xs font-serif italic text-blue-900 font-bold">VEXA IT Management</span>
                      </div>
                      <p className="text-xs font-black text-slate-900 mt-1.5">Authorized Signatory & Seal</p>
                      <p className="text-[10px] text-slate-500">{activeDoc.authorizedBy || 'VEXA IT Solutions (Pvt) Ltd'}</p>
                    </div>

                    {/* Client Acceptance */}
                    <div className="text-right">
                      <div className="h-14 border-b border-slate-400"></div>
                      <p className="text-xs font-black text-slate-900 mt-1.5">Client Acceptance & Signature</p>
                      <p className="text-[10px] text-slate-500">Date: ____ / ____ / 2026</p>
                    </div>
                  </div>

                  <div className="text-center pt-2 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400">
                      This is an official digital commercial document generated securely by VEXA IT Command Center • Colombo, Sri Lanka
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;
