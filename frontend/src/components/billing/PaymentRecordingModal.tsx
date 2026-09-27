import React, { useState } from 'react';
import { Invoice, PaymentRecord } from '../../types/billing';
import { formatCurrency } from '../../utils/billingUtils';
import {
  CreditCard,
  X,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Landmark,
  FileText,
  AlertCircle,
  Receipt,
} from 'lucide-react';

interface PaymentRecordingModalProps {
  invoice: Invoice;
  onSavePayment: (updatedInvoice: Invoice) => void;
  onClose: () => void;
  onNotify?: (text: string, type?: 'success' | 'error') => void;
}

export const PaymentRecordingModal: React.FC<PaymentRecordingModalProps> = ({
  invoice,
  onSavePayment,
  onClose,
  onNotify,
}) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(invoice.balance_due > 0 ? invoice.balance_due : 0);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentRecord['method']>('bank_transfer');
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const currentPaid = invoice.paid_amount || 0;
  const currentBalance = Math.max(0, invoice.total_amount - currentPaid);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      if (onNotify) onNotify('Please enter a valid payment amount', 'error');
      return;
    }

    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      payment_date: paymentDate,
      amount: Number(paymentAmount),
      method: paymentMethod,
      reference_no: referenceNo.trim() || undefined,
      notes: notes.trim() || undefined,
      recorded_by: 'Admin',
      created_at: new Date().toISOString(),
    };

    const updatedPayments = [...(invoice.payments || []), newPayment];
    const newTotalPaid = updatedPayments.reduce((acc, p) => acc + p.amount, 0);
    const newBalance = Math.max(0, invoice.total_amount - newTotalPaid);

    let newStatus: Invoice['status'] = invoice.status;
    if (newBalance <= 0) {
      newStatus = 'paid';
    } else if (newTotalPaid > 0) {
      newStatus = 'partially_paid';
    } else {
      newStatus = 'unpaid';
    }

    const updatedInvoice: Invoice = {
      ...invoice,
      paid_amount: newTotalPaid,
      balance_due: newBalance,
      status: newStatus,
      payments: updatedPayments,
      updated_at: new Date().toISOString(),
    };

    onSavePayment(updatedInvoice);
    if (onNotify) {
      onNotify(
        `Recorded ${formatCurrency(paymentAmount, invoice.currency)} payment for ${invoice.invoice_number}`,
        'success'
      );
    }
  };

  const handleDeletePayment = (paymentId: string) => {
    const updatedPayments = (invoice.payments || []).filter((p) => p.id !== paymentId);
    const newTotalPaid = updatedPayments.reduce((acc, p) => acc + p.amount, 0);
    const newBalance = Math.max(0, invoice.total_amount - newTotalPaid);

    let newStatus: Invoice['status'] = invoice.status;
    if (newBalance <= 0 && invoice.total_amount > 0) {
      newStatus = 'paid';
    } else if (newTotalPaid > 0) {
      newStatus = 'partially_paid';
    } else {
      newStatus = 'unpaid';
    }

    const updatedInvoice: Invoice = {
      ...invoice,
      paid_amount: newTotalPaid,
      balance_due: newBalance,
      status: newStatus,
      payments: updatedPayments,
      updated_at: new Date().toISOString(),
    };

    onSavePayment(updatedInvoice);
    if (onNotify) onNotify('Payment record removed', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl my-4 overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Record Payment</span>
                <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {invoice.invoice_number}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Log bank transfer, online IPG, or cash transactions against this invoice
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

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-thin">
          {/* Balance Overview Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice Total</span>
              <p className="text-base sm:text-lg font-black text-white font-mono mt-1">
                {formatCurrency(invoice.total_amount, invoice.currency)}
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Total Paid</span>
              <p className="text-base sm:text-lg font-black text-emerald-400 font-mono mt-1">
                {formatCurrency(currentPaid, invoice.currency)}
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Balance Due</span>
              <p className="text-base sm:text-lg font-black text-amber-400 font-mono mt-1">
                {formatCurrency(currentBalance, invoice.currency)}
              </p>
            </div>
          </div>

          {/* New Payment Form */}
          <form onSubmit={handleAddPayment} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Record New Transaction</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Payment Amount ({invoice.currency}) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={currentBalance > 0 ? currentBalance : undefined}
                    step="any"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono font-bold"
                  />
                  {currentBalance > 0 && (
                    <button
                      type="button"
                      onClick={() => setPaymentAmount(currentBalance)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold hover:bg-emerald-500/30 cursor-pointer"
                    >
                      Pay Full
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Payment Date</label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white cursor-pointer"
                >
                  <option value="bank_transfer">Direct Bank Transfer (CEFT / SLIPS)</option>
                  <option value="online_gateway">Online Payment Gateway (IPG / Card)</option>
                  <option value="cheque">Bank Cheque</option>
                  <option value="cash">Cash Settlement</option>
                  <option value="other">Other / Wire</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Reference / Transaction No
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN-892184 or CEFT Ref"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Internal Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Cleared into Commercial Bank Account"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Record Payment</span>
              </button>
            </div>
          </form>

          {/* Past Payments History Log */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Payment Transaction History ({invoice.payments?.length || 0})
            </h4>

            {!invoice.payments || invoice.payments.length === 0 ? (
              <div className="py-6 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                <Receipt className="w-8 h-8 mx-auto mb-1.5 opacity-30" />
                <p className="text-xs font-medium">No payments recorded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {invoice.payments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400">
                          {formatCurrency(pay.amount, invoice.currency)}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {pay.method.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <span>Date: {pay.payment_date}</span>
                        {pay.reference_no && <span className="ml-2 font-mono">Ref: {pay.reference_no}</span>}
                        {pay.notes && <span className="ml-2 text-slate-500 italic">({pay.notes})</span>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePayment(pay.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete this payment record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
