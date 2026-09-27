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
  const isInvoice = 'invoice_number' in doc;
  const docNumber = isInvoice ? (doc as Invoice).invoice_number : (doc as Quotation).quote_number;
  const isQuotation = !isInvoice;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let text = `=========================================\n`;
    text += `  ${isQuotation ? 'OFFICIAL COMMERCIAL QUOTATION' : 'OFFICIAL TAX INVOICE'}\n`;
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
    text += `📦 ITEMIZED DELIVERABLES & SERVICES:\n`;
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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl my-4 overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:border-0 print:shadow-none print:my-0 print:w-full print:max-w-none">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
              {docNumber}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{isQuotation ? 'Commercial Quotation' : 'Official Tax Invoice'}</span>
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
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
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
              <span>Print / PDF</span>
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
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-950 flex justify-center scrollbar-thin print:p-0 print:bg-white print:overflow-visible">
          {/* Printable White A4 Document Sheet */}
          <div
            id="printable-document"
            className="w-full max-w-3xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 space-y-6 font-sans print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none relative overflow-hidden"
          >
            {/* Top Corporate Gradient Accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#070E1E] via-[#0066FF] to-[#00D2FF] rounded-full mb-4 print:hidden" />

            {/* Header: Brand & Document Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-900 pb-6">
              <div>
                {/* Brand Logo & Name */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 relative shrink-0 flex items-center justify-center bg-[#070E1E] rounded-xl p-2 border border-blue-500/30 shadow-md">
                    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 20 L38 20 L50 68 L62 20 L82 20 L58 84 L42 84 Z" fill="#0066FF" />
                      <path d="M34 20 L54 68 L46 84 L26 36 Z" fill="#00D2FF" />
                      <path d="M50 20 L70 20 L58 56 L46 28 Z" fill="#0A192F" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-2xl font-black tracking-wider uppercase font-sans leading-none text-[#070E1E]">
                      VEXA <span className="text-[#0066FF]">IT</span>
                    </span>
                    <p className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mt-1">
                      Solutions (Pvt) Ltd
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-600 space-y-0.5">
                  <p className="font-semibold text-slate-800">{settings.address}</p>
                  <p>
                    <span className="font-semibold text-slate-700">Official Email:</span> {settings.email}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Direct Hotline:</span> {settings.phone}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Web Portal:</span> {settings.website || 'www.vexait.xyz'}
                  </p>
                  <p className="text-[10px] text-slate-500 pt-1 font-mono">
                    Company Reg: {settings.registration_no} | Tax/VAT: {settings.tax_vat_no}
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <div className="inline-block bg-[#070E1E] text-white px-4 py-2 rounded-xl shadow-sm mb-2 border-b-2 border-[#0066FF]">
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider">
                    {isQuotation ? 'COMMERCIAL QUOTATION' : 'OFFICIAL TAX INVOICE'}
                  </h2>
                </div>

                <p className="text-base font-mono font-black text-[#0066FF] mt-1">{docNumber}</p>

                <div className="mt-3 text-xs space-y-1">
                  <div className="flex sm:justify-end gap-2 text-slate-600">
                    <span className="font-bold text-slate-900">Issue Date:</span>
                    <span className="font-medium">{doc.issue_date}</span>
                  </div>
                  <div className="flex sm:justify-end gap-2 text-slate-600">
                    <span className="font-bold text-slate-900">
                      {isQuotation ? 'Validity Period:' : 'Payment Due Date:'}
                    </span>
                    <span className="font-medium">
                      {isQuotation ? (doc as Quotation).valid_until : (doc as Invoice).due_date}
                    </span>
                  </div>
                  <div className="flex sm:justify-end gap-2 text-slate-600">
                    <span className="font-bold text-slate-900">Currency:</span>
                    <span className="font-bold text-slate-950">
                      {doc.currency === 'LKR' ? 'Sri Lankan Rupees (Rs. / LKR)' : doc.currency}
                    </span>
                  </div>
                  <div className="flex sm:justify-end gap-2 text-slate-600 pt-1">
                    <span className="font-bold text-slate-900">Status:</span>
                    <span className="uppercase font-black px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800 border border-slate-300">
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info Block */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  CLIENT DETAILS / BILLED TO
                </h3>
                <p className="text-base font-black text-slate-950">{doc.client.name}</p>
                {doc.client.company && (
                  <p className="text-xs font-bold text-[#0066FF] mt-0.5">{doc.client.company}</p>
                )}
                {doc.client.billing_address && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{doc.client.billing_address}</p>
                )}
                {doc.client.tax_no && (
                  <p className="text-[11px] font-mono text-slate-600 mt-1">
                    <span className="font-bold text-slate-800">Tax/VAT No:</span> {doc.client.tax_no}
                  </p>
                )}
              </div>

              <div className="sm:text-right text-xs text-slate-600 space-y-1 flex flex-col sm:items-end justify-center">
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
                <p className="text-[11px] font-semibold text-slate-500 pt-1">
                  Prepared by: {doc.prepared_by || 'VEXA IT Engineering'}
                </p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#070E1E] text-white text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-3">Service Scope & Technical Deliverables</th>
                    <th className="py-3 px-3 text-center w-24">Qty / Unit</th>
                    <th className="py-3 px-3 text-right w-32">Unit Price</th>
                    <th className="py-3 px-3 text-right w-36">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                  {doc.items.map((item, index) => {
                    const rowTotal = item.quantity * item.unit_price;
                    return (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                        <td className="py-3.5 px-3 font-mono text-slate-400 text-center font-bold">{index + 1}</td>
                        <td className="py-3.5 px-3">
                          <p className="font-black text-slate-950 text-xs">{item.title}</p>
                          {item.description && (
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>
                          )}
                          {item.category && (
                            <span className="inline-block text-[9px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded mt-1">
                              {item.category}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center font-semibold text-slate-700">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-slate-800">
                          {formatCurrency(item.unit_price, doc.currency)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-black text-slate-950">
                          {formatCurrency(rowTotal, doc.currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Totals & Bank Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
              {/* Left: Client Notes & Bank Details */}
              <div className="space-y-3.5 text-xs text-slate-600">
                {doc.notes && (
                  <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-xl">
                    <h4 className="font-bold text-blue-900 text-[11px] uppercase tracking-wider mb-0.5">
                      Scope & Client Notes:
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-[11px]">{doc.notes}</p>
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <h4 className="font-black text-slate-950 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-blue-700" />
                    <span>Official Bank Settlement Details:</span>
                  </h4>
                  <pre className="font-sans text-[11px] whitespace-pre-line text-slate-800 font-medium leading-relaxed">
                    {doc.bank_details || settings.default_bank_details}
                  </pre>
                </div>
              </div>

              {/* Right: Calculation Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-700 py-1.5 border-b border-slate-200">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-mono font-bold text-slate-950">
                    {formatCurrency(doc.subtotal, doc.currency)}
                  </span>
                </div>

                {doc.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-700 py-1.5 border-b border-slate-200 font-semibold bg-emerald-50 px-2 rounded">
                    <span>
                      Discount ({doc.discount_type === 'percentage' ? `${doc.discount_value}%` : 'Special Fixed'}):
                    </span>
                    <span className="font-mono font-bold">-{formatCurrency(doc.discount_amount, doc.currency)}</span>
                  </div>
                )}

                {doc.tax_amount > 0 && (
                  <div className="flex justify-between text-slate-700 py-1.5 border-b border-slate-200">
                    <span className="font-semibold">{doc.tax_label || 'VAT'} ({doc.tax_rate}%):</span>
                    <span className="font-mono font-bold text-slate-950">
                      +{formatCurrency(doc.tax_amount, doc.currency)}
                    </span>
                  </div>
                )}

                {Number(doc.extra_fee) > 0 && (
                  <div className="flex justify-between text-slate-700 py-1.5 border-b border-slate-200">
                    <span className="font-semibold">{doc.extra_fee_label || 'Extra Charge'}:</span>
                    <span className="font-mono font-bold text-slate-950">
                      +{formatCurrency(doc.extra_fee, doc.currency)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center p-3.5 bg-[#070E1E] text-white rounded-xl shadow-md mt-2 border-t-2 border-[#0066FF]">
                  <span className="text-sm font-black uppercase tracking-wider">Net Amount:</span>
                  <span className="text-xl font-black text-amber-300 font-mono">
                    {formatCurrency(doc.total_amount, doc.currency)}
                  </span>
                </div>

                {/* If Invoice: Show Payment Status */}
                {isInvoice && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-[11px]">
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Total Paid:</span>
                      <span>{formatCurrency((doc as Invoice).paid_amount, doc.currency)}</span>
                    </div>
                    <div className="flex justify-between text-rose-700 font-bold">
                      <span>Balance Outstanding:</span>
                      <span>{formatCurrency((doc as Invoice).balance_due, doc.currency)}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 text-[11px] text-slate-600 italic">
                  <span className="font-bold text-slate-900 not-italic">Amount in Words: </span>
                  {numberToWords(doc.total_amount, doc.currency)}
                </div>
              </div>
            </div>

            {/* Terms of Service */}
            <div className="pt-4 border-t-2 border-slate-200 space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Terms of Service, Milestones & Guarantee</span>
                </h4>
                <p className="text-[11px] text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {doc.terms}
                </p>
              </div>

              {/* Dual Signature Block */}
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <div className="h-14 border-b-2 border-slate-400 flex items-end pb-1">
                    <span className="text-xs font-serif italic text-blue-900 font-bold">VEXA IT Management</span>
                  </div>
                  <p className="text-xs font-black text-slate-900 mt-1.5">Authorized Signatory & Seal</p>
                  <p className="text-[10px] text-slate-500">{doc.authorized_by || 'VEXA IT Solutions (Pvt) Ltd'}</p>
                </div>

                <div className="text-right">
                  <div className="h-14 border-b-2 border-slate-400"></div>
                  <p className="text-xs font-black text-slate-900 mt-1.5">Client Acceptance & Signature</p>
                  <p className="text-[10px] text-slate-500">Date: ____ / ____ / 2026</p>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-mono">
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
