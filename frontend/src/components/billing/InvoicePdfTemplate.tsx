import React, { useState } from 'react';
import { Invoice, Quotation, BillingSettings } from '../../types/billing';
import { formatCurrency, numberToWords } from '../../utils/billingUtils';
import { Printer, Share2, Check, X, Download, Landmark, FileCheck } from 'lucide-react';

interface InvoicePdfTemplateProps {
  document: Quotation | Invoice;
  settings: BillingSettings;
  onClose: () => void;
  onNotify?: (text: string, type?: 'success' | 'error') => void;
}

export const InvoicePdfTemplate: React.FC<InvoicePdfTemplateProps> = ({
  document: doc,
  settings,
  onClose,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(true);

  const isInvoice = 'invoice_number' in doc;
  const docNumber = isInvoice ? (doc as Invoice).invoice_number : (doc as Quotation).quote_number;
  const isQuotation = !isInvoice;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let text = `=========================================\n`;
    text += `  ${isQuotation ? 'COMMERCIAL QUOTATION' : 'COMMERCIAL INVOICE'}\n`;
    text += `  Ref: ${docNumber}\n`;
    text += `  Website: ${settings.website || 'www.vexait.xyz'}\n`;
    text += `=========================================\n\n`;
    text += `🏢 ISSUER: ${settings.company_name}\n`;
    text += `📍 ${settings.address} | 📞 ${settings.phone}\n`;
    text += `✉️ ${settings.email}\n\n`;
    text += `👤 CLIENT: ${doc.client.name}\n`;
    if (doc.client.company) text += `🏢 Company: ${doc.client.company}\n`;
    if (doc.client.billing_address) text += `📍 Address: ${doc.client.billing_address}\n`;
    text += `📅 Issued: ${doc.issue_date} | ${isQuotation ? 'Valid Until: ' + (doc as Quotation).valid_until : 'Due: ' + (doc as Invoice).due_date}\n\n`;
    text += `-----------------------------------------\n`;
    text += `📦 DELIVERABLES & SERVICES:\n`;
    text += `-----------------------------------------\n`;
    doc.items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.title}\n`;
      if (item.description) text += `   • Scope: ${item.description}\n`;
      text += `   • Qty: ${item.quantity} ${item.unit} @ ${formatCurrency(item.unit_price, doc.currency)} = ${formatCurrency(item.quantity * item.unit_price, doc.currency)}\n\n`;
    });
    text += `-----------------------------------------\n`;
    text += `Subtotal: ${formatCurrency(doc.subtotal, doc.currency)}\n`;
    if (doc.discount_amount > 0) {
      text += `Discount: -${formatCurrency(doc.discount_amount, doc.currency)}\n`;
    }
    if (doc.tax_amount > 0) {
      text += `Tax (${doc.tax_label || 'VAT'} ${doc.tax_rate}%): +${formatCurrency(doc.tax_amount, doc.currency)}\n`;
    }
    if (doc.extra_fee > 0) {
      text += `${doc.extra_fee_label || 'Extra Fee'}: +${formatCurrency(doc.extra_fee, doc.currency)}\n`;
    }
    text += `\n⭐️ TOTAL AMOUNT: ${formatCurrency(doc.total_amount, doc.currency)} (${doc.currency})\n`;
    if (isInvoice) {
      const inv = doc as Invoice;
      text += `💰 Paid Amount: ${formatCurrency(inv.paid_amount, inv.currency)}\n`;
      text += `🔴 Balance Due: ${formatCurrency(inv.balance_due, inv.currency)}\n`;
    }
    text += `📝 In Words: ${numberToWords(doc.total_amount, doc.currency)}\n\n`;
    text += `-----------------------------------------\n`;
    text += `🏦 BANK & SETTLEMENT DETAILS:\n`;
    text += `-----------------------------------------\n`;
    text += `${doc.bank_details || settings.default_bank_details}\n\n`;
    text += `-----------------------------------------\n`;
    text += `📌 TERMS & CONDITIONS:\n`;
    text += `-----------------------------------------\n`;
    text += `${doc.terms}\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onNotify) onNotify(`Copied ${docNumber} summary text to clipboard`, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Print Specific CSS for 1-Page Optimization */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          body {
            background-color: white !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-document {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl my-2 overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:border-0 print:shadow-none print:my-0 print:w-full print:max-w-none">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-1.5 px-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
              {docNumber}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{isQuotation ? 'Commercial Quotation' : 'Invoice'}</span>
                <span
                  className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                    doc.status === 'paid' || doc.status === 'accepted'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : doc.status === 'sent' || doc.status === 'unpaid'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {doc.status}
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  • Optimized for 1-Page A4 PDF
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Copy Summary for WhatsApp / Email"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="p-3 sm:p-6 overflow-y-auto bg-slate-950 flex justify-center scrollbar-thin print:p-0 print:bg-white print:overflow-visible">
          {/* 1-Page Optimized White A4 Document Sheet */}
          <div
            id="printable-document"
            className="w-full max-w-3xl bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-8 space-y-3.5 font-sans print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none relative overflow-hidden"
          >
            {/* Top Corporate Accent Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#070E1E] via-[#0066FF] to-[#00D2FF] rounded-full print:hidden" />

            {/* Header: Official Logo + Company Info & Document Classification */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-300 pb-3.5">
              <div className="flex items-start gap-3.5">
                {/* Official VEXA IT Logo (Attached Graphic) */}
                <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-1 shadow-sm">
                  {logoLoaded ? (
                    <img
                      src="/vexa_logo.png"
                      alt="VEXA IT Logo"
                      onError={() => setLogoLoaded(false)}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 20 L38 20 L50 68 L62 20 L82 20 L58 84 L42 84 Z" fill="#0066FF" />
                      <path d="M34 20 L54 68 L46 84 L26 36 Z" fill="#00D2FF" />
                      <path d="M50 20 L70 20 L58 56 L46 28 Z" fill="#0A192F" />
                    </svg>
                  )}
                </div>

                <div className="text-[11px] text-slate-600 leading-tight space-y-0.5">
                  <p className="text-base font-black tracking-wider uppercase text-[#070E1E] leading-none">
                    VEXA <span className="text-[#0066FF]">IT</span> SOLUTIONS
                  </p>
                  <p className="font-semibold text-slate-700">{settings.address}</p>
                  <p>
                    <span className="font-semibold text-slate-700">Email:</span> {settings.email} •{' '}
                    <span className="font-semibold text-slate-700">Hotline:</span> {settings.phone}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Reg: {settings.registration_no} | Tax/VAT: {settings.tax_vat_no} | {settings.website || 'www.vexait.xyz'}
                  </p>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <div className="inline-block bg-[#070E1E] text-white px-3 py-1 rounded-lg shadow-sm border-b border-[#0066FF]">
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-wider">
                    {isQuotation ? 'COMMERCIAL QUOTATION' : 'INVOICE'}
                  </h2>
                </div>

                <p className="text-sm font-mono font-black text-[#0066FF] mt-0.5">{docNumber}</p>

                <div className="mt-1.5 text-[11px] space-y-0.5 text-slate-600">
                  <div className="flex sm:justify-end gap-1.5">
                    <span className="font-bold text-slate-900">Issue Date:</span>
                    <span>{doc.issue_date}</span>
                  </div>
                  <div className="flex sm:justify-end gap-1.5">
                    <span className="font-bold text-slate-900">
                      {isQuotation ? 'Valid Until:' : 'Due Date:'}
                    </span>
                    <span className="font-medium text-slate-900">
                      {isQuotation ? (doc as Quotation).valid_until : (doc as Invoice).due_date}
                    </span>
                  </div>
                  <div className="flex sm:justify-end gap-1.5">
                    <span className="font-bold text-slate-900">Currency:</span>
                    <span className="font-bold text-slate-950">
                      {doc.currency === 'LKR' ? 'Sri Lankan Rupees (LKR)' : doc.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info Block (Compact) */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                  BILLED TO / CLIENT
                </h3>
                <p className="text-sm font-black text-slate-950 leading-tight">{doc.client.name}</p>
                {doc.client.company && (
                  <p className="text-[11px] font-bold text-[#0066FF] leading-tight">{doc.client.company}</p>
                )}
                {doc.client.billing_address && (
                  <p className="text-[10px] text-slate-600 leading-tight mt-0.5">{doc.client.billing_address}</p>
                )}
                {doc.client.tax_no && (
                  <p className="text-[10px] font-mono text-slate-600">
                    <span className="font-bold text-slate-800">Tax/VAT:</span> {doc.client.tax_no}
                  </p>
                )}
              </div>

              <div className="sm:text-right text-[11px] text-slate-600 space-y-0.5 flex flex-col sm:items-end justify-center">
                {doc.client.email && (
                  <p>
                    <span className="font-semibold text-slate-700">Email:</span> {doc.client.email}
                  </p>
                )}
                {doc.client.phone && (
                  <p>
                    <span className="font-semibold text-slate-700">Phone:</span> {doc.client.phone}
                  </p>
                )}
                <p className="text-[10px] font-semibold text-slate-500">
                  Prepared by: {doc.prepared_by || 'VEXA IT Engineering'}
                </p>
              </div>
            </div>

            {/* Itemized Table (Compact) */}
            <div className="overflow-hidden border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#070E1E] text-white text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2 px-2.5 text-center w-10">#</th>
                    <th className="py-2 px-2.5">Service Deliverable & Scope</th>
                    <th className="py-2 px-2.5 text-center w-20">Qty</th>
                    <th className="py-2 px-2.5 text-right w-28">Unit Price</th>
                    <th className="py-2 px-2.5 text-right w-32">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px] text-slate-800">
                  {doc.items.map((item, index) => {
                    const rowTotal = item.quantity * item.unit_price;
                    return (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                        <td className="py-2 px-2.5 font-mono text-slate-400 text-center font-bold">{index + 1}</td>
                        <td className="py-2 px-2.5">
                          <p className="font-black text-slate-950 text-xs leading-snug">{item.title}</p>
                          {item.description && (
                            <p className="text-[10px] text-slate-600 leading-tight">{item.description}</p>
                          )}
                        </td>
                        <td className="py-2 px-2.5 text-center font-semibold text-slate-700">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono text-slate-800">
                          {formatCurrency(item.unit_price, doc.currency)}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono font-black text-slate-950">
                          {formatCurrency(rowTotal, doc.currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Totals & Bank Details (Side by Side Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-200">
              {/* Left: Notes & Bank Details */}
              <div className="space-y-2 text-[10px] text-slate-600">
                {doc.notes && (
                  <div className="bg-blue-50/60 border border-blue-100 p-2 rounded-lg">
                    <span className="font-bold text-blue-900 uppercase">Notes: </span>
                    <span className="text-slate-700">{doc.notes}</span>
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <h4 className="font-black text-slate-950 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <Landmark className="w-3 h-3 text-blue-700" />
                    <span>Bank Settlement Details:</span>
                  </h4>
                  <pre className="font-sans text-[10px] whitespace-pre-line text-slate-800 font-medium leading-tight">
                    {doc.bank_details || settings.default_bank_details}
                  </pre>
                </div>
              </div>

              {/* Right: Calculations */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-700 py-0.5 border-b border-slate-200">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-mono font-bold text-slate-950">
                    {formatCurrency(doc.subtotal, doc.currency)}
                  </span>
                </div>

                {doc.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-700 py-0.5 border-b border-slate-200 font-semibold bg-emerald-50 px-1.5 rounded text-[11px]">
                    <span>Discount:</span>
                    <span className="font-mono font-bold">-{formatCurrency(doc.discount_amount, doc.currency)}</span>
                  </div>
                )}

                {doc.tax_amount > 0 && (
                  <div className="flex justify-between text-slate-700 py-0.5 border-b border-slate-200 text-[11px]">
                    <span>Tax ({doc.tax_label || 'VAT'} {doc.tax_rate}%):</span>
                    <span className="font-mono font-bold text-slate-950">
                      +{formatCurrency(doc.tax_amount, doc.currency)}
                    </span>
                  </div>
                )}

                {Number(doc.extra_fee) > 0 && (
                  <div className="flex justify-between text-slate-700 py-0.5 border-b border-slate-200 text-[11px]">
                    <span>{doc.extra_fee_label || 'Extra Fee'}:</span>
                    <span className="font-mono font-bold text-slate-950">
                      +{formatCurrency(doc.extra_fee, doc.currency)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center p-2.5 bg-[#070E1E] text-white rounded-lg shadow-sm mt-1 border-t-2 border-[#0066FF]">
                  <span className="text-xs font-black uppercase tracking-wider">Net Amount:</span>
                  <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
                    {formatCurrency(doc.total_amount, doc.currency)}
                  </span>
                </div>

                {isInvoice && (
                  <div className="p-1.5 bg-slate-50 border border-slate-200 rounded flex justify-between text-[10px] font-bold">
                    <span className="text-emerald-700">Paid: {formatCurrency((doc as Invoice).paid_amount, doc.currency)}</span>
                    <span className="text-rose-700">Due: {formatCurrency((doc as Invoice).balance_due, doc.currency)}</span>
                  </div>
                )}

                <div className="pt-1 text-[10px] text-slate-600 leading-tight">
                  <span className="font-bold text-slate-900">In Words: </span>
                  {numberToWords(doc.total_amount, doc.currency)}
                </div>
              </div>
            </div>

            {/* Terms of Service (Condensed 1-Page) */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div>
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-blue-600" />
                  <span>Terms of Service & Guarantee</span>
                </h4>
                <p className="text-[10px] text-slate-700 whitespace-pre-line leading-tight bg-slate-50 p-2 rounded border border-slate-200">
                  {doc.terms}
                </p>
              </div>

              {/* Dual Signatures */}
              <div className="grid grid-cols-2 gap-6 pt-1">
                <div>
                  <div className="h-9 border-b border-slate-400 flex items-end pb-0.5">
                    <span className="text-[11px] font-serif italic text-blue-900 font-bold">VEXA IT Management</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-900 mt-1">Authorized Signatory & Seal</p>
                </div>

                <div className="text-right">
                  <div className="h-9 border-b border-slate-400"></div>
                  <p className="text-[10px] font-bold text-slate-900 mt-1">Client Acceptance Signature</p>
                </div>
              </div>

              <div className="text-center pt-1 border-t border-slate-100">
                <p className="text-[9px] text-slate-400 font-mono">
                  Official commercial document generated by {settings.company_name} • {settings.website || 'www.vexait.xyz'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
