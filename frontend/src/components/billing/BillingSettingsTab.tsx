import React, { useState } from 'react';
import { BillingSettings } from '../../types/billing';
import { DEFAULT_BILLING_SETTINGS } from '../../utils/billingUtils';
import {
  Building,
  Landmark,
  FileCheck,
  Percent,
  Save,
  RotateCcw,
  Sliders,
  Check,
  Globe,
  Mail,
  Phone,
  MapPin,
  Bell,
} from 'lucide-react';

interface BillingSettingsTabProps {
  settings: BillingSettings;
  onUpdateSettings: (newSettings: BillingSettings) => void;
  onNotify?: (text: string, type?: 'success' | 'error') => void;
}

export const BillingSettingsTab: React.FC<BillingSettingsTabProps> = ({
  settings,
  onUpdateSettings,
  onNotify,
}) => {
  const [formData, setFormData] = useState<BillingSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setIsSaved(true);
    if (onNotify) onNotify('Billing & PDF templates configuration saved', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (!window.confirm('Reset billing settings and default terms to system defaults?')) return;
    setFormData(DEFAULT_BILLING_SETTINGS);
    onUpdateSettings(DEFAULT_BILLING_SETTINGS);
    if (onNotify) onNotify('Reset billing settings to default', 'success');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F172A] p-5 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <span>Billing Templates, Tax & PDF Branding (www.vexait.xyz)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure official corporate details, bank settlement information, standard terms, and numbering rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Saved Settings!' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* 1. Official Corporate Info & Tax ID */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Building className="w-4 h-4 text-blue-400" />
          <span>Official Company & Legal Details</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company Legal Name</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Web Portal URL</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-blue-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Official Billing Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hotline / Direct Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company Reg # (PV No)</label>
            <input
              type="text"
              value={formData.registration_no}
              onChange={(e) => setFormData({ ...formData, registration_no: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tax / VAT / SVAT Reg #</label>
            <input
              type="text"
              value={formData.tax_vat_no}
              onChange={(e) => setFormData({ ...formData, tax_vat_no: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Official Registered Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Numbering Prefixes & Defaults */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Percent className="w-4 h-4 text-emerald-400" />
          <span>Numbering Rules, Default Currency & Tax Rates</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Default Currency</label>
            <select
              value={formData.default_currency}
              onChange={(e) => setFormData({ ...formData, default_currency: e.target.value as any })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-blue-400 font-bold cursor-pointer"
            >
              <option value="LKR">LKR (Rs.) — Sri Lankan Rupee</option>
              <option value="USD">USD ($) — US Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="GBP">GBP (£) — British Pound</option>
              <option value="AUD">AUD (A$) — Australian Dollar</option>
              <option value="AED">AED — UAE Dirham</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Quotation Prefix</label>
            <input
              type="text"
              value={formData.quote_prefix}
              onChange={(e) => setFormData({ ...formData, quote_prefix: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Invoice Prefix</label>
            <input
              type="text"
              value={formData.invoice_prefix}
              onChange={(e) => setFormData({ ...formData, invoice_prefix: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Default Quote Validity (Days)</label>
            <input
              type="number"
              min="1"
              value={formData.default_quote_validity_days}
              onChange={(e) =>
                setFormData({ ...formData, default_quote_validity_days: parseInt(e.target.value, 10) || 30 })
              }
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono text-center"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Default Invoice Due (Days)</label>
            <input
              type="number"
              min="1"
              value={formData.default_invoice_due_days}
              onChange={(e) =>
                setFormData({ ...formData, default_invoice_due_days: parseInt(e.target.value, 10) || 14 })
              }
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono text-center"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Default Tax Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="any"
              value={formData.default_tax_rate}
              onChange={(e) => setFormData({ ...formData, default_tax_rate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tax Label</label>
            <input
              type="text"
              value={formData.default_tax_label}
              onChange={(e) => setFormData({ ...formData, default_tax_label: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.auto_reminders_enabled}
                onChange={(e) => setFormData({ ...formData, auto_reminders_enabled: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0"
              />
              <span className="font-semibold">Enable Automated Payment Reminders</span>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Bank Account & Terms Templates */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Landmark className="w-4 h-4 text-amber-400" />
          <span>Default Banking Information & Standard Terms Templates</span>
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-blue-400" />
              <span>Official Bank Account Details</span>
            </label>
            <textarea
              rows={8}
              value={formData.default_bank_details}
              onChange={(e) => setFormData({ ...formData, default_bank_details: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Default Quotation Terms & Milestones</span>
            </label>
            <textarea
              rows={8}
              value={formData.default_quote_terms}
              onChange={(e) => setFormData({ ...formData, default_quote_terms: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Default Invoice Terms & Settlement</span>
            </label>
            <textarea
              rows={8}
              value={formData.default_invoice_terms}
              onChange={(e) => setFormData({ ...formData, default_invoice_terms: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 leading-relaxed"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
