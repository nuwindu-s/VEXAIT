import React, { useState, useEffect } from 'react';
import {
  BillingSettings,
  CatalogItem,
  Client,
  CurrencyCode,
  Invoice,
  LineItem,
  Quotation,
} from '../../types/billing';
import {
  calculateTotals,
  formatCurrency,
  numberToWords,
} from '../../utils/billingUtils';
import {
  X,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  FileText,
  Receipt,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Landmark,
  FileCheck,
  BadgePercent,
  Check,
  Eye,
  Layers,
} from 'lucide-react';

interface DocumentBuilderModalProps {
  mode: 'create' | 'edit';
  documentType: 'quotation' | 'invoice';
  initialDocument?: Quotation | Invoice | null;
  settings: BillingSettings;
  catalog: CatalogItem[];
  clientsList?: Client[];
  inquiriesList?: any[];
  onSave: (doc: Quotation | Invoice, previewImmediately?: boolean) => void;
  onClose: () => void;
  onNotify?: (text: string, type?: 'success' | 'error') => void;
}

export const DocumentBuilderModal: React.FC<DocumentBuilderModalProps> = ({
  mode,
  documentType,
  initialDocument,
  settings,
  catalog,
  clientsList = [],
  inquiriesList = [],
  onSave,
  onClose,
  onNotify,
}) => {
  const isInvoice = documentType === 'invoice';

  // Generate Default ID and Number
  const generateNewDocNumber = (type: 'quotation' | 'invoice') => {
    const prefix = type === 'quotation' ? settings.quote_prefix || 'VEXA-QUO' : settings.invoice_prefix || 'VEXA-INV';
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${year}-${randomSeq}`;
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDueDate = new Date(
    Date.now() + (isInvoice ? settings.default_invoice_due_days : settings.default_quote_validity_days) * 86400000
  )
    .toISOString()
    .split('T')[0];

  // Document Form State
  const [docNumber, setDocNumber] = useState<string>(
    initialDocument
      ? isInvoice
        ? (initialDocument as Invoice).invoice_number
        : (initialDocument as Quotation).quote_number
      : generateNewDocNumber(documentType)
  );

  const [issueDate, setIssueDate] = useState<string>(initialDocument?.issue_date || todayStr);
  const [validUntilOrDueDate, setValidUntilOrDueDate] = useState<string>(
    initialDocument
      ? isInvoice
        ? (initialDocument as Invoice).due_date
        : (initialDocument as Quotation).valid_until
      : defaultDueDate
  );

  const [status, setStatus] = useState<string>(initialDocument?.status || 'draft');
  const [currency, setCurrency] = useState<CurrencyCode>(initialDocument?.currency || settings.default_currency || 'LKR');

  // Client State
  const [client, setClient] = useState<Client>(
    initialDocument?.client || {
      id: 'client-' + Date.now(),
      name: '',
      company: '',
      email: '',
      phone: '',
      billing_address: '',
      tax_no: '',
    }
  );

  // Line Items State
  const [items, setItems] = useState<LineItem[]>(
    initialDocument?.items && initialDocument.items.length > 0
      ? initialDocument.items
      : [
          {
            id: 'item-1',
            title: isInvoice ? 'Delivered Enterprise Software Development' : 'Custom Web & Software Development',
            description: 'Architecture design, responsive UI implementation, API integrations, testing, and deployment.',
            category: 'Web Development',
            quantity: 1,
            unit: 'project',
            unit_price: isInvoice ? 150000 : 185000,
            total: isInvoice ? 150000 : 185000,
          },
        ]
  );

  // Adjustments State
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(
    initialDocument?.discount_type || 'percentage'
  );
  const [discountValue, setDiscountValue] = useState<number>(initialDocument?.discount_value || 0);
  const [taxRate, setTaxRate] = useState<number>(initialDocument?.tax_rate || settings.default_tax_rate || 0);
  const [taxLabel, setTaxLabel] = useState<string>(
    initialDocument?.tax_label || settings.default_tax_label || 'VAT / SSCL'
  );
  const [extraFee, setExtraFee] = useState<number>(initialDocument?.extra_fee || 0);
  const [extraFeeLabel, setExtraFeeLabel] = useState<string>(
    initialDocument?.extra_fee_label || 'Cloud Hosting & Domain Setup'
  );

  // Notes, Terms, Bank
  const [notes, setNotes] = useState<string>(
    initialDocument?.notes || 'Includes 60-day complimentary post-launch support and full source code handover.'
  );
  const [terms, setTerms] = useState<string>(
    initialDocument?.terms || (isInvoice ? settings.default_invoice_terms : settings.default_quote_terms)
  );
  const [bankDetails, setBankDetails] = useState<string>(
    initialDocument?.bank_details || settings.default_bank_details
  );
  const [preparedBy, setPreparedBy] = useState<string>(
    initialDocument?.prepared_by || 'VEXA IT Engineering Team'
  );
  const [authorizedBy, setAuthorizedBy] = useState<string>(
    initialDocument?.authorized_by || 'Director of Technology, VEXA IT'
  );

  // Auto-calculated Financial Totals
  const { subtotal, discountAmount, discountedSubtotal, taxAmount, grandTotal } = calculateTotals(
    items,
    discountType,
    discountValue,
    taxRate,
    extraFee
  );

  // Add Item
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: 'item-' + Date.now(),
        title: '',
        description: '',
        category: 'Services',
        quantity: 1,
        unit: 'unit',
        unit_price: 0,
        total: 0,
      },
    ]);
  };

  // Add from Catalog
  const handleAddFromCatalog = (catItem: CatalogItem) => {
    setItems((prev) => [
      ...prev,
      {
        id: 'item-' + Date.now(),
        title: catItem.title,
        description: catItem.description,
        category: catItem.category,
        quantity: 1,
        unit: catItem.unit,
        unit_price: catItem.default_price,
        total: catItem.default_price,
      },
    ]);
    if (onNotify) onNotify(`Added "${catItem.title}" to items`, 'success');
  };

  // Update Line Item Field
  const handleUpdateItem = (itemId: string, field: keyof LineItem, value: any) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const updated = { ...it, [field]: value };
        if (field === 'quantity' || field === 'unit_price') {
          const q = field === 'quantity' ? Number(value) || 0 : it.quantity;
          const p = field === 'unit_price' ? Number(value) || 0 : it.unit_price;
          updated.total = q * p;
        }
        return updated;
      })
    );
  };

  // Reorder Item (Up/Down)
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setItems(reordered);
  };

  // Remove Item
  const handleRemoveItem = (itemId: string) => {
    if (items.length <= 1) {
      if (onNotify) onNotify('A document must have at least one line item', 'error');
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  // Quick Client Import
  const handleSelectInquiryLead = (leadId: string) => {
    const lead = inquiriesList.find((i) => i._id === leadId || i.id === leadId);
    if (!lead) return;
    setClient({
      id: 'client-' + Date.now(),
      name: lead.name || client.name,
      company: lead.company || client.company,
      email: lead.email || client.email,
      phone: lead.phone || client.phone,
      billing_address: client.billing_address || 'Colombo, Sri Lanka',
      tax_no: client.tax_no || '',
    });
    if (lead.details) {
      setNotes(`Client Requirements: ${lead.details}`);
    }
    if (onNotify) onNotify(`Auto-populated client details for ${lead.name}`, 'success');
  };

  // Save Document
  const handleFormSubmit = (e: React.FormEvent, previewImmediately = false) => {
    e.preventDefault();

    if (!docNumber.trim()) {
      if (onNotify) onNotify('Document Number is required', 'error');
      return;
    }
    if (!client.name.trim()) {
      if (onNotify) onNotify('Client Name is required', 'error');
      return;
    }
    if (items.some((it) => !it.title.trim())) {
      if (onNotify) onNotify('All line items must have a title', 'error');
      return;
    }

    const baseDoc = {
      id: initialDocument?.id || 'doc-' + Date.now(),
      client,
      items,
      currency,
      discount_type: discountType,
      discount_value: Number(discountValue) || 0,
      tax_rate: Number(taxRate) || 0,
      tax_label: taxLabel,
      extra_fee: Number(extraFee) || 0,
      extra_fee_label: extraFeeLabel,
      subtotal,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      total_amount: grandTotal,
      issue_date: issueDate,
      notes,
      terms,
      bank_details: bankDetails,
      prepared_by: preparedBy,
      authorized_by: authorizedBy,
      created_at: initialDocument?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isInvoice) {
      const existingPaid = (initialDocument as Invoice)?.paid_amount || 0;
      const existingPayments = (initialDocument as Invoice)?.payments || [];
      const balanceDue = Math.max(0, grandTotal - existingPaid);

      const invoiceDoc: Invoice = {
        ...baseDoc,
        invoice_number: docNumber,
        quote_id: (initialDocument as Invoice)?.quote_id,
        quote_number: (initialDocument as Invoice)?.quote_number,
        due_date: validUntilOrDueDate,
        status: (status as any) || 'unpaid',
        paid_amount: existingPaid,
        balance_due: balanceDue,
        payments: existingPayments,
        reminders_enabled: true,
      };
      onSave(invoiceDoc, previewImmediately);
    } else {
      const quotationDoc: Quotation = {
        ...baseDoc,
        quote_number: docNumber,
        valid_until: validUntilOrDueDate,
        status: (status as any) || 'sent',
        converted_invoice_id: (initialDocument as Quotation)?.converted_invoice_id,
      };
      onSave(quotationDoc, previewImmediately);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl my-4 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              {isInvoice ? <Receipt className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>
                  {mode === 'edit' ? 'Edit' : 'Create'}{' '}
                  {isInvoice ? 'Official Tax Invoice' : 'Commercial Quotation'}
                </span>
                <span className="text-xs font-mono font-normal text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  {docNumber}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Itemized deliverables, LKR / multi-currency pricing, corporate discounts & terms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={(e) => handleFormSubmit(e, false)}
          className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-thin"
        >
          {/* Top Classification Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Document Number</label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-blue-400 font-bold cursor-pointer"
              >
                <option value="LKR">LKR (Rs.) — Sri Lankan Rupee</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="AUD">AUD (A$) — Australian Dollar</option>
                <option value="AED">AED — UAE Dirham</option>
                <option value="SGD">SGD (S$) — Singapore Dollar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Date</label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isInvoice ? 'Payment Due Date' : 'Quotation Valid Until'}
              </label>
              <input
                type="date"
                required
                value={validUntilOrDueDate}
                onChange={(e) => setValidUntilOrDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white cursor-pointer"
              />
            </div>
          </div>

          {/* Client Billed-To Section with Quick Lead Import */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-400" />
                <span>Client & Billing Organization</span>
              </h4>

              {inquiriesList.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Import Lead:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleSelectInquiryLead(e.target.value);
                    }}
                    defaultValue=""
                    className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 cursor-pointer"
                  >
                    <option value="" disabled>
                      Select an inquiry lead...
                    </option>
                    {inquiriesList.map((inq) => (
                      <option key={inq._id || inq.id} value={inq._id || inq.id}>
                        {inq.name} {inq.company ? `(${inq.company})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Client Contact Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chaminda Rajapakse"
                  value={client.name}
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Ceylinco Logistics (Pvt) Ltd"
                  value={client.company || ''}
                  onChange={(e) => setClient({ ...client, company: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Client Email Address</label>
                <input
                  type="email"
                  placeholder="chaminda@company.lk"
                  value={client.email}
                  onChange={(e) => setClient({ ...client, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+94 77 123 4567"
                  value={client.phone || ''}
                  onChange={(e) => setClient({ ...client, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Billing Address & Tax/VAT #
                </label>
                <input
                  type="text"
                  placeholder="Level 12, WTC, Echelon Square, Colombo 01 | VAT-114892019"
                  value={client.billing_address || ''}
                  onChange={(e) => setClient({ ...client, billing_address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Line Items Builder Section */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Itemized Deliverables & Scope of Work</span>
              </h4>

              {/* Quick Add from Catalog */}
              {catalog.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Insert from Catalog:</span>
                  <select
                    onChange={(e) => {
                      const item = catalog.find((c) => c.id === e.target.value);
                      if (item) handleAddFromCatalog(item);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-emerald-400 font-semibold cursor-pointer"
                  >
                    <option value="" disabled>
                      Select service package...
                    </option>
                    {catalog.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title} ({formatCurrency(cat.default_price, currency)})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Line Items List */}
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 transition-colors"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                    {/* Index & Reorder Controls */}
                    <div className="sm:col-span-1 flex sm:flex-col items-center justify-between sm:justify-center gap-1">
                      <span className="text-xs font-mono font-bold text-slate-500">#{index + 1}</span>
                      <div className="flex sm:flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveItem(index, 'up')}
                          className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === items.length - 1}
                          onClick={() => handleMoveItem(index, 'down')}
                          className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Item / Service Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Enterprise Web Application"
                        value={item.title}
                        onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-semibold"
                      />
                    </div>

                    {/* Quantity & Unit */}
                    <div className="sm:col-span-2 grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">Qty</label>
                        <input
                          type="number"
                          min="1"
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">Unit</label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-300 text-center"
                        />
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                        Unit Price ({currency})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.unit_price}
                        onChange={(e) => handleUpdateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono font-bold text-right"
                      />
                    </div>

                    {/* Total & Remove */}
                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0">
                      <div className="text-right">
                        <div className="text-[9px] text-slate-500 uppercase font-bold">Line Total</div>
                        <div className="text-xs font-black text-white font-mono">
                          {formatCurrency(item.quantity * item.unit_price, currency)}
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

                  {/* Scope Notes / Technical Deliverables */}
                  <div>
                    <input
                      type="text"
                      placeholder="Detailed scope / deliverables (e.g. Responsive design, API integrations, high-speed hosting setup)..."
                      value={item.description || ''}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg text-[11px] text-slate-300 placeholder-slate-600 italic"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-2.5 bg-slate-800/60 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-400" />
              <span>Add Custom Deliverable Row</span>
            </button>
          </div>

          {/* Discounts, Tax & Financial Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
            {/* Adjustment Controls */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <BadgePercent className="w-4 h-4 text-amber-400" />
                <span>Commercial Discounts & Taxes</span>
              </h4>

              {/* Discount Mode */}
              <div className="p-3 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Discount Mode</label>
                  <div className="flex bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setDiscountType('percentage')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                        discountType === 'percentage' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiscountType('fixed')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                        discountType === 'fixed' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Fixed ({currency})
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max={discountType === 'percentage' ? 100 : undefined}
                    step="any"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-bold font-mono"
                  />
                  <span className="text-xs text-amber-400 font-bold whitespace-nowrap">
                    {discountType === 'percentage' ? '% OFF' : currency}
                  </span>
                </div>
              </div>

              {/* Tax & Extra Surcharge */}
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
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Extra Surcharge ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={extraFee}
                    onChange={(e) => setExtraFee(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white font-bold font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Live Financial Summary Card */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5 flex flex-col justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Financial Summary ({currency})
              </h4>

              <div className="space-y-2 text-xs divide-y divide-slate-800/80">
                <div className="flex justify-between text-slate-300 pt-1">
                  <span>Items Subtotal:</span>
                  <span className="font-mono font-bold">{formatCurrency(subtotal, currency)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-400 pt-1 font-semibold">
                    <span>
                      Discount ({discountType === 'percentage' ? `${discountValue}%` : formatCurrency(discountValue, currency)}):
                    </span>
                    <span className="font-mono">-{formatCurrency(discountAmount, currency)}</span>
                  </div>
                )}

                {taxAmount > 0 && (
                  <div className="flex justify-between text-slate-300 pt-1">
                    <span>Tax ({taxLabel} {taxRate}%):</span>
                    <span className="font-mono font-bold">+{formatCurrency(taxAmount, currency)}</span>
                  </div>
                )}

                {Number(extraFee) > 0 && (
                  <div className="flex justify-between text-slate-300 pt-1">
                    <span>{extraFeeLabel}:</span>
                    <span className="font-mono font-bold">+{formatCurrency(extraFee, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-white pt-3 border-t-2 border-slate-700">
                  <span className="text-sm font-black uppercase">Net Total:</span>
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 font-mono">
                    {formatCurrency(grandTotal, currency)}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded-lg italic">
                Amount in words:{' '}
                <span className="text-slate-200 font-medium">{numberToWords(grandTotal, currency)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms & Bank Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-blue-400" />
                <span>Bank Settlement & Wire Details</span>
              </label>
              <textarea
                rows={4}
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Standard Terms & Conditions</span>
              </label>
              <textarea
                rows={4}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 leading-relaxed"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 bg-[#0F172A] py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => handleFormSubmit(e, true)}
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
                <span>Save {isInvoice ? 'Invoice' : 'Quotation'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
