import React, { useState, useEffect, useMemo } from 'react';
import {
  BillingSettings,
  CatalogItem,
  Client,
  Invoice,
  Quotation,
} from '../../types/billing';
import {
  DEFAULT_BILLING_SETTINGS,
  DEFAULT_CATALOG_ITEMS,
  formatCurrency,
} from '../../utils/billingUtils';
import { DocumentTable } from './DocumentTable';
import { DocumentBuilderModal } from './DocumentBuilderModal';
import { InvoicePdfTemplate } from './InvoicePdfTemplate';
import { PaymentRecordingModal } from './PaymentRecordingModal';
import { ItemsCatalogTab } from './ItemsCatalogTab';
import { BillingSettingsTab } from './BillingSettingsTab';
import {
  FileText,
  Receipt,
  Plus,
  Package,
  Sliders,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  BarChart3,
  Percent,
} from 'lucide-react';

interface QuotationInvoiceDashboardProps {
  inquiries?: any[];
  onNotify?: (text: string, type?: 'success' | 'error') => void;
}

export const QuotationInvoiceDashboard: React.FC<QuotationInvoiceDashboardProps> = ({
  inquiries = [],
  onNotify,
}) => {
  // Navigation Sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'quotations' | 'invoices' | 'catalog' | 'settings'>('quotations');

  // Persistence: Settings
  const [settings, setSettings] = useState<BillingSettings>(() => {
    const saved = localStorage.getItem('vexa_billing_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_BILLING_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('vexa_billing_config', JSON.stringify(settings));
  }, [settings]);

  // Persistence: Catalog
  const [catalog, setCatalog] = useState<CatalogItem[]>(() => {
    const saved = localStorage.getItem('vexa_service_catalog');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_CATALOG_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('vexa_service_catalog', JSON.stringify(catalog));
  }, [catalog]);

  // Sample seed data for Quotations & Invoices in LKR
  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('vexa_quotations_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }

    const today = new Date().toISOString().split('T')[0];
    const validUntil = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    return [
      {
        id: 'quo-sample-1',
        quote_number: 'VEXA-QUO-2026-001',
        client: {
          id: 'cli-1',
          name: 'Chaminda Rajapakse',
          company: 'Ceylinco Logistics & Maritime (Pvt) Ltd',
          email: 'chaminda@ceylincologistics.lk',
          phone: '+94 77 345 8920',
          billing_address: 'Level 12, World Trade Center, Echelon Square, Colombo 01',
          tax_no: 'VAT-114892019-7000',
        },
        items: [
          {
            id: 'item-1',
            title: 'Custom Corporate Web Application & Real-Time Cargo Tracking System',
            description: 'Full-stack responsive web platform, customer tracking portal, role-based auth, cloud database.',
            category: 'Web Development',
            quantity: 1,
            unit: 'project',
            unit_price: 185000,
            total: 185000,
          },
          {
            id: 'item-2',
            title: 'Executive UI/UX Interactive Design System & Brand Asset Kit (Figma)',
            description: 'Wireframes, interactive clickable prototypes, design tokens, component library.',
            category: 'UI/UX Design',
            quantity: 1,
            unit: 'package',
            unit_price: 65000,
            total: 65000,
          },
          {
            id: 'item-3',
            title: 'Automated WhatsApp Business API & SMS Gateway Integration',
            description: 'Automated status alerts for container dispatch and delivery tracking.',
            category: 'Integration',
            quantity: 1,
            unit: 'integration',
            unit_price: 45000,
            total: 45000,
          },
        ],
        currency: 'LKR',
        discount_type: 'percentage',
        discount_value: 10,
        tax_rate: 0,
        tax_label: 'VAT / SSCL',
        extra_fee: 0,
        extra_fee_label: 'Setup Fee',
        subtotal: 295000,
        discount_amount: 29500,
        tax_amount: 0,
        total_amount: 265500,
        issue_date: today,
        valid_until: validUntil,
        status: 'sent',
        notes: 'Includes full source code repository, SSL certificate setup, and 60 days dedicated technical maintenance SLA.',
        terms: DEFAULT_BILLING_SETTINGS.default_quote_terms,
        bank_details: DEFAULT_BILLING_SETTINGS.default_bank_details,
        prepared_by: 'Nuwindu S. (Lead Architect)',
        authorized_by: 'Director of Technology, VEXA IT',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('vexa_invoices_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }

    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

    return [
      {
        id: 'inv-sample-1',
        invoice_number: 'VEXA-INV-2026-001',
        quote_id: 'quo-sample-0',
        quote_number: 'VEXA-QUO-2026-000',
        client: {
          id: 'cli-2',
          name: 'Dr. Rohan De Silva',
          company: 'Lanka HealthNet Solutions (Pvt) Ltd',
          email: 'rohan.desilva@lankahealth.lk',
          phone: '+94 71 889 1234',
          billing_address: 'No. 45, Horton Place, Colombo 07, Sri Lanka',
          tax_no: 'TIN-109283741',
        },
        items: [
          {
            id: 'item-10',
            title: 'Online Medical Appointment Booking & Doctor Portal Development',
            description: 'Milestone 1: Backend architecture, database schema, doctor calendar, and patient SMS notifications.',
            category: 'Software Engineering',
            quantity: 1,
            unit: 'milestone',
            unit_price: 145000,
            total: 145000,
          },
          {
            id: 'item-11',
            title: 'Commercial Bank IPG (Internet Payment Gateway) Integration',
            description: 'Direct 3D-Secure 2.0 checkout, tokenization, transaction logging, and automated digital receipts.',
            category: 'FinTech',
            quantity: 1,
            unit: 'module',
            unit_price: 55000,
            total: 55000,
          },
        ],
        currency: 'LKR',
        discount_type: 'fixed',
        discount_value: 15000,
        tax_rate: 0,
        tax_label: 'VAT / SSCL',
        extra_fee: 0,
        extra_fee_label: 'Service Fee',
        subtotal: 200000,
        discount_amount: 15000,
        tax_amount: 0,
        total_amount: 185000,
        paid_amount: 185000,
        balance_due: 0,
        issue_date: today,
        due_date: dueDate,
        status: 'paid',
        notes: 'Milestone 1 payment cleared. Production environment activated on high-performance cloud server.',
        terms: DEFAULT_BILLING_SETTINGS.default_invoice_terms,
        bank_details: DEFAULT_BILLING_SETTINGS.default_bank_details,
        payments: [
          {
            id: 'pay-1',
            payment_date: today,
            amount: 185000,
            method: 'bank_transfer',
            reference_no: 'CEFT-TXN-902184',
            notes: 'Commercial Bank Online Transfer cleared',
            recorded_by: 'Finance Admin',
            created_at: new Date().toISOString(),
          },
        ],
        reminders_enabled: true,
        prepared_by: 'Finance & Accounts',
        authorized_by: 'VEXA IT Management Board',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('vexa_quotations_list', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('vexa_invoices_list', JSON.stringify(invoices));
  }, [invoices]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderType, setBuilderType] = useState<'quotation' | 'invoice'>('quotation');
  const [builderMode, setBuilderMode] = useState<'create' | 'edit'>('create');
  const [activeDocForBuilder, setActiveDocForBuilder] = useState<Quotation | Invoice | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeDocForPreview, setActiveDocForPreview] = useState<Quotation | Invoice | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeInvoiceForPayment, setActiveInvoiceForPayment] = useState<Invoice | null>(null);

  // Executive KPI Metrics Calculation
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalOutstanding = 0;
    let activeQuotesValue = 0;
    let activeQuotesCount = 0;
    let convertedQuotesCount = 0;

    invoices.forEach((inv) => {
      totalRevenue += inv.paid_amount || 0;
      if (inv.status !== 'paid' && inv.status !== 'cancelled') {
        totalOutstanding += inv.balance_due || 0;
      }
    });

    quotations.forEach((q) => {
      if (q.status === 'sent' || q.status === 'draft') {
        activeQuotesValue += q.total_amount || 0;
        activeQuotesCount++;
      }
      if (q.status === 'accepted' || q.converted_invoice_id) {
        convertedQuotesCount++;
      }
    });

    const conversionRate =
      quotations.length > 0 ? Math.round((convertedQuotesCount / quotations.length) * 100) : 0;

    return {
      totalRevenue,
      totalOutstanding,
      activeQuotesValue,
      activeQuotesCount,
      conversionRate,
      totalQuotations: quotations.length,
      totalInvoices: invoices.length,
    };
  }, [quotations, invoices]);

  // Handler: Open Create Modal
  const handleOpenCreate = (type: 'quotation' | 'invoice') => {
    setBuilderType(type);
    setBuilderMode('create');
    setActiveDocForBuilder(null);
    setIsBuilderOpen(true);
  };

  // Handler: Open Edit Modal
  const handleOpenEdit = (doc: Quotation | Invoice) => {
    const isInv = 'invoice_number' in doc;
    setBuilderType(isInv ? 'invoice' : 'quotation');
    setBuilderMode('edit');
    setActiveDocForBuilder(doc);
    setIsBuilderOpen(true);
  };

  // Handler: Open Preview Modal
  const handleOpenPreview = (doc: Quotation | Invoice) => {
    setActiveDocForPreview(doc);
    setIsPreviewOpen(true);
  };

  // Handler: Open Payment Modal
  const handleOpenPayment = (inv: Invoice) => {
    setActiveInvoiceForPayment(inv);
    setIsPaymentModalOpen(true);
  };

  // Handler: Save from DocumentBuilderModal
  const handleSaveDocument = (doc: Quotation | Invoice, previewImmediately = false) => {
    const isInv = 'invoice_number' in doc;

    if (isInv) {
      const invoice = doc as Invoice;
      setInvoices((prev) => {
        const exists = prev.some((d) => d.id === invoice.id);
        if (exists) {
          return prev.map((d) => (d.id === invoice.id ? invoice : d));
        }
        return [invoice, ...prev];
      });
      if (onNotify) onNotify(`Saved Invoice ${invoice.invoice_number}`, 'success');
    } else {
      const quote = doc as Quotation;
      setQuotations((prev) => {
        const exists = prev.some((d) => d.id === quote.id);
        if (exists) {
          return prev.map((d) => (d.id === quote.id ? quote : d));
        }
        return [quote, ...prev];
      });
      if (onNotify) onNotify(`Saved Quotation ${quote.quote_number}`, 'success');
    }

    setIsBuilderOpen(false);

    if (previewImmediately) {
      setActiveDocForPreview(doc);
      setIsPreviewOpen(true);
    }
  };

  // Handler: Convert Quote to Invoice
  const handleConvertQuoteToInvoice = (quote: Quotation) => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    const invNumber = `${settings.invoice_prefix || 'VEXA-INV'}-${year}-${String(count).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + (settings.default_invoice_due_days || 14) * 86400000)
      .toISOString()
      .split('T')[0];

    const newInvoice: Invoice = {
      id: 'inv-' + Date.now(),
      invoice_number: invNumber,
      quote_id: quote.id,
      quote_number: quote.quote_number,
      client: { ...quote.client },
      items: quote.items.map((it) => ({ ...it })),
      currency: quote.currency,
      discount_type: quote.discount_type,
      discount_value: quote.discount_value,
      tax_rate: quote.tax_rate,
      tax_label: quote.tax_label,
      extra_fee: quote.extra_fee,
      extra_fee_label: quote.extra_fee_label,
      subtotal: quote.subtotal,
      discount_amount: quote.discount_amount,
      tax_amount: quote.tax_amount,
      total_amount: quote.total_amount,
      paid_amount: 0,
      balance_due: quote.total_amount,
      issue_date: today,
      due_date: dueDate,
      status: 'unpaid',
      notes: quote.notes || `Converted from quotation ${quote.quote_number}`,
      terms: settings.default_invoice_terms,
      bank_details: quote.bank_details || settings.default_bank_details,
      payments: [],
      reminders_enabled: true,
      prepared_by: quote.prepared_by,
      authorized_by: quote.authorized_by,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Update Quotation Status to Accepted and set converted invoice id
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quote.id
          ? { ...q, status: 'accepted', converted_invoice_id: newInvoice.id, updated_at: new Date().toISOString() }
          : q
      )
    );

    // Add Invoice
    setInvoices((prev) => [newInvoice, ...prev]);

    if (onNotify) {
      onNotify(`Successfully converted ${quote.quote_number} to Invoice ${newInvoice.invoice_number}`, 'success');
    }
    setActiveSubTab('invoices');
  };

  // Handler: Duplicate Document
  const handleDuplicateDocument = (doc: Quotation | Invoice) => {
    const isInv = 'invoice_number' in doc;
    const year = new Date().getFullYear();
    const count = (isInv ? invoices.length : quotations.length) + 1;
    const prefix = isInv ? settings.invoice_prefix || 'VEXA-INV' : settings.quote_prefix || 'VEXA-QUO';
    const newNum = `${prefix}-${year}-${String(count).padStart(3, '0')}`;

    if (isInv) {
      const duplicated: Invoice = {
        ...(doc as Invoice),
        id: 'inv-' + Date.now(),
        invoice_number: newNum,
        status: 'draft',
        paid_amount: 0,
        balance_due: (doc as Invoice).total_amount,
        payments: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setInvoices((prev) => [duplicated, ...prev]);
    } else {
      const duplicated: Quotation = {
        ...(doc as Quotation),
        id: 'quo-' + Date.now(),
        quote_number: newNum,
        status: 'draft',
        converted_invoice_id: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setQuotations((prev) => [duplicated, ...prev]);
    }

    if (onNotify) onNotify(`Created copy: ${newNum}`, 'success');
  };

  // Handler: Delete Document
  const handleDeleteDocument = (id: string, docNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete ${docNumber}?`)) return;

    setQuotations((prev) => prev.filter((d) => d.id !== id));
    setInvoices((prev) => prev.filter((d) => d.id !== id));

    if (onNotify) onNotify(`Deleted ${docNumber}`, 'success');
  };

  // Handler: Update Status
  const handleStatusChange = (id: string, newStatus: any) => {
    setQuotations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus, updated_at: new Date().toISOString() } : d))
    );
    setInvoices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus, updated_at: new Date().toISOString() } : d))
    );
    if (onNotify) onNotify(`Status updated to ${newStatus.toUpperCase()}`, 'success');
  };

  // Handler: Save Payment on Invoice
  const handleSavePayment = (updatedInvoice: Invoice) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv)));
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Executive KPI Metric Cards in LKR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Settled Revenue */}
        <div className="bg-[#0F172A] border border-slate-800 p-4.5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Settled Revenue (LKR)</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 font-mono">
              {formatCurrency(metrics.totalRevenue, 'LKR')}
            </p>
            <p className="text-[11px] text-emerald-500 mt-0.5 font-medium">Cleared bank payments</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Outstanding Invoices */}
        <div className="bg-[#0F172A] border border-slate-800 p-4.5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Outstanding Due (LKR)</p>
            <p className="text-xl sm:text-2xl font-black text-amber-400 mt-1 font-mono">
              {formatCurrency(metrics.totalOutstanding, 'LKR')}
            </p>
            <p className="text-[11px] text-amber-500 mt-0.5 font-medium">Awaiting settlement</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Active Quotations Value */}
        <div className="bg-[#0F172A] border border-slate-800 p-4.5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Pipeline (LKR)</p>
            <p className="text-xl sm:text-2xl font-black text-blue-400 mt-1 font-mono">
              {formatCurrency(metrics.activeQuotesValue, 'LKR')}
            </p>
            <p className="text-[11px] text-blue-500 mt-0.5 font-medium">{metrics.activeQuotesCount} open proposals</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-[#0F172A] border border-slate-800 p-4.5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Proposal Conversion</p>
            <p className="text-xl sm:text-2xl font-black text-indigo-400 mt-1 font-mono">
              {metrics.conversionRate}%
            </p>
            <p className="text-[11px] text-indigo-500 mt-0.5 font-medium">Quote to Invoice rate</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Module Navigation Bar & Action Triggers */}
      <div className="bg-[#0F172A] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Sub-tab Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 overflow-x-auto">
          <button
            onClick={() => {
              setActiveSubTab('quotations');
              setStatusFilter('all');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'quotations'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quotations</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 border border-white/10 font-mono">
              {quotations.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('invoices');
              setStatusFilter('all');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'invoices'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Invoices</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 border border-white/10 font-mono">
              {invoices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'catalog'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Items Catalog</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 border border-white/10 font-mono">
              {catalog.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'settings'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Templates & Tax</span>
          </button>
        </div>

        {/* Action Buttons */}
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
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Content Rendering */}
      {activeSubTab === 'quotations' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search quotations by quote #, client name, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0F172A] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-[#0F172A] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Quotation Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <DocumentTable
            type="quotation"
            documents={quotations}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onPreview={handleOpenPreview}
            onEdit={handleOpenEdit}
            onDuplicate={handleDuplicateDocument}
            onDelete={handleDeleteDocument}
            onStatusChange={handleStatusChange}
            onConvertToInvoice={handleConvertQuoteToInvoice}
            onNotify={onNotify}
          />
        </div>
      )}

      {activeSubTab === 'invoices' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoices by invoice #, client name, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0F172A] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-[#0F172A] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Invoice Statuses</option>
              <option value="draft">Draft</option>
              <option value="unpaid">Unpaid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Paid (Settled)</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <DocumentTable
            type="invoice"
            documents={invoices}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onPreview={handleOpenPreview}
            onEdit={handleOpenEdit}
            onDuplicate={handleDuplicateDocument}
            onDelete={handleDeleteDocument}
            onStatusChange={handleStatusChange}
            onRecordPayment={handleOpenPayment}
            onNotify={onNotify}
          />
        </div>
      )}

      {activeSubTab === 'catalog' && (
        <div className="animate-fadeIn">
          <ItemsCatalogTab
            catalog={catalog}
            onUpdateCatalog={setCatalog}
            onNotify={onNotify}
          />
        </div>
      )}

      {activeSubTab === 'settings' && (
        <div className="animate-fadeIn">
          <BillingSettingsTab
            settings={settings}
            onUpdateSettings={setSettings}
            onNotify={onNotify}
          />
        </div>
      )}

      {/* =========================================================================
          MODALS INTEGRATION
         ========================================================================= */}

      {/* 1. Document Builder Modal (Create / Edit) */}
      {isBuilderOpen && (
        <DocumentBuilderModal
          mode={builderMode}
          documentType={builderType}
          initialDocument={activeDocForBuilder}
          settings={settings}
          catalog={catalog}
          inquiriesList={inquiries}
          onSave={handleSaveDocument}
          onClose={() => setIsBuilderOpen(false)}
          onNotify={onNotify}
        />
      )}

      {/* 2. PDF Preview / Print Modal */}
      {isPreviewOpen && activeDocForPreview && (
        <InvoicePdfTemplate
          document={activeDocForPreview}
          settings={settings}
          onClose={() => setIsPreviewOpen(false)}
          onNotify={onNotify}
        />
      )}

      {/* 3. Payment Recording Modal */}
      {isPaymentModalOpen && activeInvoiceForPayment && (
        <PaymentRecordingModal
          invoice={activeInvoiceForPayment}
          onSavePayment={handleSavePayment}
          onClose={() => setIsPaymentModalOpen(false)}
          onNotify={onNotify}
        />
      )}
    </div>
  );
};

export default QuotationInvoiceDashboard;
