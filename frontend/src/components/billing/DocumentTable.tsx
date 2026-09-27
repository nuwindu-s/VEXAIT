import React, { useState } from 'react';
import { Invoice, Quotation } from '../../types/billing';
import { formatCurrency } from '../../utils/billingUtils';
import {
  Eye,
  Edit3,
  Copy,
  Check,
  Receipt,
  Layers,
  Trash2,
  Percent,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  FileText,
  Share2,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface DocumentTableProps {
  type: 'quotation' | 'invoice';
  documents: (Quotation | Invoice)[];
  searchQuery: string;
  statusFilter: string;
  onPreview: (doc: Quotation | Invoice) => void;
  onEdit: (doc: Quotation | Invoice) => void;
  onDuplicate: (doc: Quotation | Invoice) => void;
  onDelete: (id: string, docNumber: string) => void;
  onStatusChange: (id: string, newStatus: any) => void;
  onConvertToInvoice?: (quote: Quotation) => void;
  onRecordPayment?: (invoice: Invoice) => void;
  onNotify?: (text: string, type?: 'success' | 'error') => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  type,
  documents,
  searchQuery,
  statusFilter,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
  onStatusChange,
  onConvertToInvoice,
  onRecordPayment,
  onNotify,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isInvoice = type === 'invoice';

  // Filter Documents
  const filteredDocs = documents.filter((doc) => {
    const docNum = isInvoice ? (doc as Invoice).invoice_number : (doc as Quotation).quote_number;
    const matchesSearch =
      docNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.client.company && doc.client.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.client.email && doc.client.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'accepted':
        return 'bg-emerald-950/60 border-emerald-700/80 text-emerald-300';
      case 'sent':
        return 'bg-blue-950/60 border-blue-700/80 text-blue-300';
      case 'partially_paid':
        return 'bg-amber-950/60 border-amber-700/80 text-amber-300';
      case 'overdue':
      case 'declined':
        return 'bg-rose-950/60 border-rose-700/80 text-rose-300';
      case 'expired':
      case 'cancelled':
        return 'bg-slate-800 border-slate-700 text-slate-400';
      default:
        return 'bg-slate-800/80 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Document #</th>
              <th className="py-3.5 px-4">Client & Organization</th>
              <th className="py-3.5 px-4">Dates</th>
              <th className="py-3.5 px-4">Line Items</th>
              <th className="py-3.5 px-4">Total ({isInvoice ? 'Net & Due' : 'Amount'})</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  {isInvoice ? (
                    <Receipt className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  ) : (
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  )}
                  <p className="font-semibold">No {isInvoice ? 'invoices' : 'quotations'} match your search</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Click "Create {isInvoice ? 'Invoice' : 'Quotation'}" to start a new document
                  </p>
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => {
                const docNum = isInvoice ? (doc as Invoice).invoice_number : (doc as Quotation).quote_number;
                const dueDate = isInvoice ? (doc as Invoice).due_date : (doc as Quotation).valid_until;

                return (
                  <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Doc # */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white font-mono flex items-center gap-2">{docNum}</div>
                      {isInvoice && (doc as Invoice).quote_number && (
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          From: {(doc as Invoice).quote_number}
                        </div>
                      )}
                      {!isInvoice && (doc as Quotation).converted_invoice_id && (
                        <span className="inline-block text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded mt-1">
                          Converted to Invoice
                        </span>
                      )}
                    </td>

                    {/* Client */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{doc.client.name}</div>
                      {doc.client.company && (
                        <div className="text-[11px] text-blue-400 font-medium">{doc.client.company}</div>
                      )}
                      {doc.client.email && <div className="text-[10px] text-slate-500">{doc.client.email}</div>}
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] text-slate-300">
                        <span className="text-slate-500">Issued:</span> {doc.issue_date}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        <span className="text-slate-500">{isInvoice ? 'Due:' : 'Valid:'}</span> {dueDate}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] text-slate-300">
                        {doc.items.length} {doc.items.length === 1 ? 'item' : 'items'}
                      </div>
                      {doc.discount_amount > 0 ? (
                        <div className="text-[10px] text-amber-400 mt-0.5 flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          <span>
                            {doc.discount_type === 'percentage'
                              ? `${doc.discount_value}% OFF`
                              : `${formatCurrency(doc.discount_value, doc.currency)} OFF`}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500 mt-0.5">Standard pricing</div>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4">
                      <div className="text-sm font-black text-white font-mono">
                        {formatCurrency(doc.total_amount, doc.currency)}
                      </div>
                      {isInvoice && (
                        <div className="text-[10px] mt-0.5 font-mono">
                          {(doc as Invoice).balance_due <= 0 ? (
                            <span className="text-emerald-400 font-bold">Fully Settled</span>
                          ) : (
                            <span className="text-rose-400">
                              Due: {formatCurrency((doc as Invoice).balance_due, doc.currency)}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={doc.status}
                        onChange={(e) => onStatusChange(doc.id, e.target.value)}
                        className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border cursor-pointer focus:outline-none ${getStatusBadge(
                          doc.status
                        )}`}
                      >
                        {isInvoice ? (
                          <>
                            <option value="draft">Draft</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="partially_paid">Partially Paid</option>
                            <option value="paid">Paid (Settled)</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
                          </>
                        ) : (
                          <>
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="accepted">Accepted</option>
                            <option value="declined">Declined</option>
                            <option value="expired">Expired</option>
                          </>
                        )}
                      </select>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview / PDF */}
                        <button
                          onClick={() => onPreview(doc)}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors cursor-pointer"
                          title="Preview & Print PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEdit(doc)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                          title="Edit Document"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Record Payment (Invoice Only) */}
                        {isInvoice && onRecordPayment && (
                          <button
                            onClick={() => onRecordPayment(doc as Invoice)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                            title="Record Payment / View Transactions"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                        )}

                        {/* Convert to Invoice (Quotation Only) */}
                        {!isInvoice && onConvertToInvoice && (
                          <button
                            onClick={() => onConvertToInvoice(doc as Quotation)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                            title="Convert Quote to Official Tax Invoice"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}

                        {/* Duplicate */}
                        <button
                          onClick={() => onDuplicate(doc)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                          title="Duplicate"
                        >
                          <Layers className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDelete(doc.id, docNum)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                          title="Delete Document"
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
  );
};
