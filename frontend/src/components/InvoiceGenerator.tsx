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
} from 'lucide-react';
import { useSite } from '../context/SiteContext';

export interface InvoiceItem {
  id: string;
  description: string;
  category?: string;
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
  items: InvoiceItem[];
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  taxRate: number;
  extraFee: number;
  extraFeeLabel: string;
  notes: string;
  paymentTerms: string;
  bankDetails: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceGeneratorProps {
  inquiries?: any[];
  onNotify?: (text: string, type?: 'success' | 'error') => void;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  LKR: 'Rs. ',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  AED: 'AED ',
  SGD: 'S$',
};

const DEFAULT_BANK_DETAILS = `Bank Name: Commercial Bank of Ceylon
Account Name: VEXA IT Solutions (Pvt) Ltd
Account Number: 8009214782
Branch: Colombo Fort (Code: 045)
SWIFT / BIC: CCEYLKLX
Payment Reference: Please quote Quotation/Invoice Number`;

const DEFAULT_TERMS_QUOTATION = `1. This quotation is valid for 30 calendar days from the issue date.
2. 50% initial advance deposit required upon project sign-off to commence engineering.
3. 25% milestone payment upon beta preview approval; 25% final settlement upon production launch.
4. Includes 30 days of post-deployment technical maintenance and bug fixes.`;

const DEFAULT_TERMS_INVOICE = `1. Payment is due within 14 days of invoice issue date.
2. Please transfer funds to the designated bank account or online gateway.
3. Late payments past 30 days are subject to a 2% monthly administrative fee.
4. Thank you for choosing VEXA IT for your digital and engineering needs!`;

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

    // Default starter sample documents
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
        currency: 'USD',
        clientName: 'Sarah Jenkins',
        clientCompany: 'Apex Global Logistics',
        clientEmail: 'sarah@apexgl.com',
        clientPhone: '+1 (555) 234-5678',
        clientAddress: '742 Evergreen Terrace, Suite 400, Chicago, IL',
        items: [
          {
            id: 'item-1',
            description: 'Custom Enterprise Web Portal & Client Dashboard',
            category: 'Web Development',
            quantity: 1,
            unit: 'project',
            unitPrice: 3800,
          },
          {
            id: 'item-2',
            description: 'Interactive UI/UX Prototyping & Design System (Figma)',
            category: 'UI/UX Design',
            quantity: 1,
            unit: 'package',
            unitPrice: 1200,
          },
          {
            id: 'item-3',
            description: 'High-Performance Cloud API & Database Architecture',
            category: 'Software Engineering',
            quantity: 1,
            unit: 'setup',
            unitPrice: 950,
          },
        ],
        discountType: 'percentage',
        discountValue: 10,
        taxRate: 0,
        extraFee: 0,
        extraFeeLabel: 'Handling Fee',
        notes: 'Includes dedicated account manager and SSL security integration.',
        paymentTerms: DEFAULT_TERMS_QUOTATION,
        bankDetails: DEFAULT_BANK_DETAILS,
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
        currency: 'USD',
        clientName: 'David Chen',
        clientCompany: 'Nexus FinTech Labs',
        clientEmail: 'david@nexusfin.io',
        clientPhone: '+1 (415) 890-1234',
        clientAddress: '101 Market St, San Francisco, CA 94105',
        items: [
          {
            id: 'item-10',
            description: 'E-Commerce Platform Modernization & Payment Gateway Integration',
            category: 'E-Commerce',
            quantity: 1,
            unit: 'milestone',
            unitPrice: 2800,
          },
          {
            id: 'item-11',
            description: 'Mobile App API Endpoints & Push Notification Service',
            category: 'Mobile & Cloud',
            quantity: 1,
            unit: 'module',
            unitPrice: 1400,
          },
        ],
        discountType: 'fixed',
        discountValue: 200,
        taxRate: 0,
        extraFee: 0,
        extraFeeLabel: 'Service Fee',
        notes: 'First milestone invoice - 50% project kickoff payment.',
        paymentTerms: DEFAULT_TERMS_INVOICE,
        bankDetails: DEFAULT_BANK_DETAILS,
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

  // Editor Form State
  const initialFormState: InvoiceDoc = {
    id: '',
    docType: 'quotation',
    docNumber: '',
    status: 'draft',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    currency: 'USD',
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    items: [
      {
        id: 'item-' + Date.now(),
        description: 'Web Application Development & UI System',
        category: 'Web Development',
        quantity: 1,
        unit: 'project',
        unitPrice: 1500,
      },
    ],
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 0,
    extraFee: 0,
    extraFeeLabel: 'Extra Service Fee',
    notes: 'Thank you for partnering with VEXA IT.',
    paymentTerms: DEFAULT_TERMS_QUOTATION,
    bankDetails: DEFAULT_BANK_DETAILS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [formData, setFormData] = useState<InvoiceDoc>(initialFormState);

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
          description: isQuo ? 'Custom Solution Architecture & Implementation' : 'Delivered Engineering Services',
          category: 'Software Engineering',
          quantity: 1,
          unit: 'project',
          unitPrice: 1800,
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
    notify(`Imported contact details for ${lead.name}`);
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

  // Insert from Pricing Catalog
  const handleInsertPricingPackage = (serviceName: string, pkgName: string, priceStr: string) => {
    // Parse numeric price
    const numPrice = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: 'item-' + Date.now(),
          description: `${serviceName} - ${pkgName}`,
          category: serviceName,
          quantity: 1,
          unit: 'package',
          unitPrice: numPrice,
        },
      ],
    }));
    notify(`Added ${pkgName} (${priceStr}) to items`);
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

  // Summary Metrics
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

  // Copy Email / WhatsApp Summary
  const handleCopySummaryText = (doc: InvoiceDoc) => {
    const { subtotal, discountAmount, taxAmount, grandTotal } = calculateTotals(doc);
    const sym = CURRENCY_SYMBOLS[doc.currency] || '$';
    const isQuo = doc.docType === 'quotation';

    let text = `📄 ${isQuo ? 'QUOTATION' : 'INVOICE'}: ${doc.docNumber}\n`;
    text += `🏢 Issuer: ${settings?.name || 'VEXA IT Solutions'}\n`;
    text += `👤 Client: ${doc.clientName}${doc.clientCompany ? ` (${doc.clientCompany})` : ''}\n`;
    text += `📅 Issue Date: ${doc.issueDate} | Due: ${doc.dueDate}\n\n`;
    text += `📦 LINE ITEMS:\n`;
    doc.items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.description} - ${item.quantity} ${item.unit} x ${sym}${item.unitPrice.toLocaleString()} = ${sym}${(item.quantity * item.unitPrice).toLocaleString()}\n`;
    });
    text += `\n💰 Subtotal: ${sym}${subtotal.toLocaleString()}\n`;
    if (discountAmount > 0) {
      text += `🏷️ Discount (${doc.discountType === 'percentage' ? `${doc.discountValue}%` : 'Fixed'}): -${sym}${discountAmount.toLocaleString()}\n`;
    }
    if (taxAmount > 0) {
      text += `🏛️ Tax (${doc.taxRate}%): +${sym}${taxAmount.toLocaleString()}\n`;
    }
    if (doc.extraFee > 0) {
      text += `➕ ${doc.extraFeeLabel}: +${sym}${doc.extraFee.toLocaleString()}\n`;
    }
    text += `\n⭐️ GRAND TOTAL: ${sym}${grandTotal.toLocaleString()} ${doc.currency}\n\n`;
    text += `🏦 PAYMENT DETAILS:\n${doc.bankDetails}\n\n`;
    text += `📌 TERMS:\n${doc.paymentTerms}\n`;

    navigator.clipboard.writeText(text);
    setCopiedId(doc.id);
    notify(`Copied ${doc.docNumber} summary to clipboard`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Trigger Print View
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Quotations</p>
            <p className="text-2xl font-black text-white mt-1">
              ${metrics.totalQuotesValue.toLocaleString()}
            </p>
            <p className="text-[11px] text-blue-400 mt-0.5">{metrics.quotesCount} active proposals</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Paid Invoices</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              ${metrics.paidInvoicesValue.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-500 mt-0.5">Cleared revenue</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending / Unpaid</p>
            <p className="text-2xl font-black text-amber-400 mt-1">
              ${metrics.pendingInvoicesValue.toLocaleString()}
            </p>
            <p className="text-[11px] text-amber-500 mt-0.5">Awaiting settlement</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">All Documents</p>
            <p className="text-2xl font-black text-white mt-1">{metrics.totalDocs}</p>
            <p className="text-[11px] text-indigo-400 mt-0.5">Quotations & Invoices</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
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
              placeholder="Search document #, client, company..."
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
            <span>New Quotation</span>
          </button>
          <button
            onClick={() => handleOpenCreate('invoice')}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>New Invoice / Bill</span>
          </button>
        </div>
      </div>

      {/* Document History Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Doc # & Type</th>
                <th className="py-3.5 px-4">Client & Company</th>
                <th className="py-3.5 px-4">Issue / Due Date</th>
                <th className="py-3.5 px-4">Items & Discount</th>
                <th className="py-3.5 px-4">Total Amount</th>
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
                    <p className="text-[11px] text-slate-600 mt-0.5">Click "New Quotation" or "New Invoice" to create one</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const { discountAmount, grandTotal } = calculateTotals(doc);
                  const sym = CURRENCY_SYMBOLS[doc.currency] || '$';
                  const isQuo = doc.docType === 'quotation';

                  return (
                    <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Doc # and Type */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{doc.docNumber}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isQuo
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {doc.docType}
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
                              {doc.discountType === 'percentage' ? `${doc.discountValue}% OFF` : `${sym}${doc.discountValue} OFF`}
                            </span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 mt-0.5">No discount</div>
                        )}
                      </td>

                      {/* Grand Total */}
                      <td className="py-3.5 px-4">
                        <div className="text-sm font-black text-white">
                          {sym}{grandTotal.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase">{doc.currency}</div>
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
                            title="Preview & Print PDF"
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
                              title="Convert to Invoice"
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
          MODAL 1: DOCUMENT EDITOR (CREATE & EDIT QUOTE / INVOICE)
         ========================================================================= */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl my-6 overflow-hidden animate-scaleUp">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
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
                      : `Create New ${formData.docType === 'quotation' ? 'Quotation' : 'Invoice / Bill'}`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure line items, manual unit prices, discounts, and terms
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
                    <option value="quotation">Quotation / Proposal</option>
                    <option value="invoice">Tax Invoice</option>
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
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white cursor-pointer font-bold"
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="LKR">LKR (Rs.) - Sri Lankan Rupee</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="AUD">AUD (A$) - Australian Dollar</option>
                    <option value="CAD">CAD (C$) - Canadian Dollar</option>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="SGD">SGD (S$) - Singapore Dollar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="approved">Approved</option>
                    <option value="paid">Paid</option>
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
                    <span>Client Information</span>
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
                      Client Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Innovations Ltd"
                      value={formData.clientCompany}
                      onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Billing Address & Location</label>
                    <input
                      type="text"
                      placeholder="Street address, City, State, Country"
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
                    <span>{formData.docType === 'quotation' ? 'Quote Valid Until' : 'Payment Due Date'}</span>
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
                    <span>Itemized Services & Pricing</span>
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
                        <option value="">Insert from Service Catalog...</option>
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

                <div className="space-y-2">
                  {formData.items.map((item, index) => {
                    const rowTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                    const sym = CURRENCY_SYMBOLS[formData.currency] || '$';

                    return (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                      >
                        {/* Item Description */}
                        <div className="sm:col-span-6">
                          <label className="block text-[10px] font-medium text-slate-400 mb-1">
                            Service / Task Description #{index + 1}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Responsive Full-Stack Web Development"
                            value={item.description}
                            onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                          />
                        </div>

                        {/* Quantity & Unit */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-medium text-slate-400 mb-1">Qty / Unit</label>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              min="1"
                              step="0.5"
                              required
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                              className="w-16 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white text-center font-bold"
                            />
                            <input
                              type="text"
                              placeholder="unit"
                              value={item.unit}
                              onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>

                        {/* Unit Price Input */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-medium text-slate-400 mb-1">
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
                            className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-bold text-right"
                          />
                        </div>

                        {/* Calculated Row Total & Delete */}
                        <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                          <div className="text-right">
                            <div className="text-[10px] text-slate-500 uppercase">Subtotal</div>
                            <div className="text-xs font-black text-white">
                              {sym}{rowTotal.toLocaleString()}
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
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-2.5 bg-slate-800/60 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-blue-400" />
                  <span>Add Custom Line Item</span>
                </button>
              </div>

              {/* Discounts, Tax & Financial Summary Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                {/* Adjustments: Discount, Tax %, Extra fees */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Percent className="w-4 h-4 text-amber-400" />
                    <span>Discount & Adjustments</span>
                  </h4>

                  {/* Discount controls */}
                  <div className="p-3 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Discount Option</label>
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
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-bold"
                      />
                      <span className="text-xs text-slate-400 font-bold whitespace-nowrap">
                        {formData.discountType === 'percentage' ? '% OFF' : formData.currency}
                      </span>
                    </div>
                  </div>

                  {/* Tax & Extra Fees */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Tax / VAT Rate (%)
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
                        className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Extra Charges ({formData.currency})
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
                        className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Calculated Totals Card */}
                {(() => {
                  const { subtotal, discountAmount, discountedSubtotal, taxAmount, grandTotal } =
                    calculateTotals(formData);
                  const sym = CURRENCY_SYMBOLS[formData.currency] || '$';

                  return (
                    <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Financial Summary
                      </h4>

                      <div className="space-y-2 text-xs divide-y divide-slate-800/80">
                        <div className="flex justify-between text-slate-300 pt-1">
                          <span>Items Subtotal:</span>
                          <span className="font-mono font-bold">
                            {sym}{subtotal.toLocaleString()}
                          </span>
                        </div>

                        {discountAmount > 0 && (
                          <div className="flex justify-between text-amber-400 pt-1 font-semibold">
                            <span>
                              Discount (
                              {formData.discountType === 'percentage'
                                ? `${formData.discountValue}%`
                                : `${sym}${formData.discountValue}`}
                              ):
                            </span>
                            <span className="font-mono">-{sym}{discountAmount.toLocaleString()}</span>
                          </div>
                        )}

                        {taxAmount > 0 && (
                          <div className="flex justify-between text-slate-300 pt-1">
                            <span>Tax / VAT ({formData.taxRate}%):</span>
                            <span className="font-mono font-bold">+{sym}{taxAmount.toLocaleString()}</span>
                          </div>
                        )}

                        {Number(formData.extraFee) > 0 && (
                          <div className="flex justify-between text-slate-300 pt-1">
                            <span>{formData.extraFeeLabel || 'Extra Fee'}:</span>
                            <span className="font-mono font-bold">+{sym}{Number(formData.extraFee).toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-white pt-3 border-t-2 border-slate-700">
                          <span className="text-sm font-black uppercase">Grand Total:</span>
                          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 font-mono">
                            {sym}{grandTotal.toLocaleString()} {formData.currency}
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 bg-slate-900 p-2 rounded-lg text-center">
                        All numbers updated in real-time as prices and quantities change.
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Payment Details & Terms (Collapsible/Editable) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                    <span>Bank & Settlement Information</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bankDetails}
                    onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Terms & Conditions / Client Notes</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300"
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
                    <span>Save & Preview PDF</span>
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
          MODAL 2: PRINT-READY A4 PREVIEW & PDF EXPORTER MODAL
         ========================================================================= */}
      {isPreviewOpen && activeDoc && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl my-4 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Top Toolbar (Hidden when printing via @media print) */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0 print:hidden">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{activeDoc.docNumber}</span>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                      {activeDoc.docType}
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopySummaryText(activeDoc)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  {copiedId === activeDoc.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-lg shadow-blue-600/20 cursor-pointer"
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
              {/* The Actual Branded Document Sheet */}
              <div
                id="printable-document"
                className="w-full max-w-3xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 space-y-8 font-sans print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none"
              >
                {/* Header: Company Logo & Document Title */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-md">
                        V
                      </div>
                      <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">
                          {settings?.name || 'VEXA IT SOLUTIONS'}
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">
                          Next-Gen Engineering & Digital Architecture
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-slate-600 space-y-0.5">
                      <p>{settings?.location || 'Colombo, Sri Lanka & Global Operations'}</p>
                      <p>Email: {settings?.email || 'contact@vexait.com'}</p>
                      <p>Phone: {settings?.phone || '+94 77 123 4567'}</p>
                      <p>Web: https://vexait.com</p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <h2 className="text-3xl font-black uppercase tracking-tight text-blue-600">
                      {activeDoc.docType === 'quotation'
                        ? 'QUOTATION'
                        : activeDoc.docType === 'invoice'
                        ? 'TAX INVOICE'
                        : 'BILL / RECEIPT'}
                    </h2>
                    <p className="text-sm font-mono font-bold text-slate-800 mt-1">
                      {activeDoc.docNumber}
                    </p>

                    <div className="mt-4 text-xs space-y-1">
                      <div className="flex sm:justify-end gap-2 text-slate-600">
                        <span className="font-semibold text-slate-800">Date Issued:</span>
                        <span>{activeDoc.issueDate}</span>
                      </div>
                      <div className="flex sm:justify-end gap-2 text-slate-600">
                        <span className="font-semibold text-slate-800">
                          {activeDoc.docType === 'quotation' ? 'Valid Until:' : 'Due Date:'}
                        </span>
                        <span>{activeDoc.dueDate}</span>
                      </div>
                      <div className="flex sm:justify-end gap-2 text-slate-600">
                        <span className="font-semibold text-slate-800">Status:</span>
                        <span className="uppercase font-bold text-blue-600">{activeDoc.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Bill To Block */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      BILL TO / CLIENT
                    </h3>
                    <p className="text-base font-bold text-slate-900">{activeDoc.clientName}</p>
                    {activeDoc.clientCompany && (
                      <p className="text-xs font-semibold text-slate-700">{activeDoc.clientCompany}</p>
                    )}
                    {activeDoc.clientAddress && (
                      <p className="text-xs text-slate-600 mt-1">{activeDoc.clientAddress}</p>
                    )}
                  </div>

                  <div className="sm:text-right text-xs text-slate-600 space-y-1 flex flex-col sm:items-end justify-center">
                    {activeDoc.clientEmail && <p>Email: {activeDoc.clientEmail}</p>}
                    {activeDoc.clientPhone && <p>Phone: {activeDoc.clientPhone}</p>}
                    <p className="text-[11px] text-slate-400 font-mono">Currency: {activeDoc.currency}</p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        <th className="py-3 px-2">#</th>
                        <th className="py-3 px-2">Description & Scope</th>
                        <th className="py-3 px-2 text-center">Qty / Unit</th>
                        <th className="py-3 px-2 text-right">Unit Price</th>
                        <th className="py-3 px-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                      {activeDoc.items.map((item, index) => {
                        const sym = CURRENCY_SYMBOLS[activeDoc.currency] || '$';
                        const rowTotal = item.quantity * item.unitPrice;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="py-3 px-2 font-mono text-slate-400">{index + 1}</td>
                            <td className="py-3 px-2">
                              <p className="font-bold text-slate-900">{item.description}</p>
                              {item.category && (
                                <span className="text-[10px] text-slate-500">{item.category}</span>
                              )}
                            </td>
                            <td className="py-3 px-2 text-center text-slate-700">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="py-3 px-2 text-right font-mono">
                              {sym}{item.unitPrice.toLocaleString()}
                            </td>
                            <td className="py-3 px-2 text-right font-mono font-bold text-slate-900">
                              {sym}{rowTotal.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Totals & Notes Section */}
                {(() => {
                  const { subtotal, discountAmount, taxAmount, grandTotal } = calculateTotals(activeDoc);
                  const sym = CURRENCY_SYMBOLS[activeDoc.currency] || '$';

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                      {/* Left: Notes & Bank Details */}
                      <div className="space-y-4 text-xs text-slate-600">
                        {activeDoc.notes && (
                          <div>
                            <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-1">
                              Client Notes:
                            </h4>
                            <p className="text-slate-600">{activeDoc.notes}</p>
                          </div>
                        )}

                        <div>
                          <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-1">
                            Bank & Wire Settlement:
                          </h4>
                          <pre className="font-sans text-[11px] whitespace-pre-line text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {activeDoc.bankDetails}
                          </pre>
                        </div>
                      </div>

                      {/* Right: Calculations */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                          <span>Subtotal:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {sym}{subtotal.toLocaleString()}
                          </span>
                        </div>

                        {discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-600 py-1 border-b border-slate-100 font-semibold">
                            <span>
                              Discount (
                              {activeDoc.discountType === 'percentage'
                                ? `${activeDoc.discountValue}%`
                                : `${sym}${activeDoc.discountValue}`}
                              ):
                            </span>
                            <span className="font-mono">-{sym}{discountAmount.toLocaleString()}</span>
                          </div>
                        )}

                        {taxAmount > 0 && (
                          <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                            <span>Tax / VAT ({activeDoc.taxRate}%):</span>
                            <span className="font-mono font-bold text-slate-900">
                              +{sym}{taxAmount.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {Number(activeDoc.extraFee) > 0 && (
                          <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                            <span>{activeDoc.extraFeeLabel || 'Extra Fee'}:</span>
                            <span className="font-mono font-bold text-slate-900">
                              +{sym}{Number(activeDoc.extraFee).toLocaleString()}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center py-3 border-t-2 border-slate-900 text-slate-900">
                          <span className="text-base font-black uppercase">Grand Total:</span>
                          <span className="text-2xl font-black text-blue-600 font-mono">
                            {sym}{grandTotal.toLocaleString()} {activeDoc.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Terms and Signature footer */}
                <div className="pt-6 border-t border-slate-200 space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Terms & Payment Conditions
                    </h4>
                    <p className="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed">
                      {activeDoc.paymentTerms}
                    </p>
                  </div>

                  <div className="flex justify-between items-end pt-4">
                    <div>
                      <p className="text-[10px] text-slate-400">Generated securely by VEXA IT Command Center</p>
                    </div>
                    <div className="text-right">
                      <div className="w-44 border-b border-slate-400 mb-1"></div>
                      <p className="text-xs font-bold text-slate-800">Authorized Signature</p>
                      <p className="text-[10px] text-slate-500">VEXA IT Management</p>
                    </div>
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
