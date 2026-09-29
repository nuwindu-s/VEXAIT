import React, { useState, useRef, useEffect } from 'react';
import {
  SupportedCurrency,
  SUPPORTED_CURRENCIES,
  CurrencyOption,
} from '../utils/currency';
import { ChevronDown, Globe, Check } from 'lucide-react';

interface CurrencySelectorProps {
  selectedCurrency: SupportedCurrency;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  variant?: 'default' | 'compact' | 'dark';
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  variant = 'default',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption =
    SUPPORTED_CURRENCIES.find((c) => c.code === selectedCurrency) ||
    SUPPORTED_CURRENCIES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedCurrency) => {
    onCurrencyChange(code);
    setIsOpen(false);
  };

  if (variant === 'dark') {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00D2FF]/50"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="text-sm leading-none">{activeOption.flag}</span>
          <span className="font-bold tracking-wide">{activeOption.code}</span>
          <span className="text-slate-300 text-[11px]">({activeOption.symbol})</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0A192F] border border-slate-700/80 shadow-2xl z-50 py-1.5 backdrop-blur-xl animate-scaleUp overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select Currency
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {SUPPORTED_CURRENCIES.map((currency) => {
                const isSelected = currency.code === selectedCurrency;
                return (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => handleSelect(currency.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/30 text-[#00D2FF] font-bold'
                        : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{currency.flag}</span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">{currency.code}</span>
                          <span className="text-[11px] text-slate-400">({currency.symbol})</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{currency.name}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#00D2FF]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs focus:outline-none"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="text-xs">{activeOption.flag}</span>
          <span className="font-bold">{activeOption.code}</span>
          <span className="text-slate-500 text-[10px]">({activeOption.symbol})</span>
          <ChevronDown
            className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white border border-slate-200 shadow-xl z-50 py-1 animate-scaleUp overflow-hidden">
            <div className="max-h-56 overflow-y-auto">
              {SUPPORTED_CURRENCIES.map((currency) => {
                const isSelected = currency.code === selectedCurrency;
                return (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => handleSelect(currency.code)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors text-left cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span className="font-bold">{currency.code}</span>
                      <span className="text-[10px] text-slate-500">({currency.symbol})</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>Currency:</span>
        </label>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300/90 text-slate-900 text-xs font-bold shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="text-base leading-none">{activeOption.flag}</span>
          <span className="text-slate-900 font-extrabold">{activeOption.code}</span>
          <span className="text-slate-500 font-medium">({activeOption.symbol})</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-600' : ''
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-24 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 py-2 animate-scaleUp overflow-hidden">
          <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Change Pricing Currency
            </span>
            <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              Default: USD
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {SUPPORTED_CURRENCIES.map((currency) => {
              const isSelected = currency.code === selectedCurrency;
              return (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => handleSelect(currency.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors text-left cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 text-blue-700 font-bold border-l-2 border-blue-600'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg leading-none">{currency.flag}</span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{currency.code}</span>
                        <span className="text-slate-500 text-[11px]">({currency.symbol})</span>
                        {currency.code === 'USD' && (
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-1 rounded font-normal">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {currency.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
