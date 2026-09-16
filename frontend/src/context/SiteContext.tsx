import React, { createContext, useContext, useState, useEffect } from 'react';
import { companyData, CompanyInfo } from '../data/company';
import { pricingData, ServicePricing } from '../data/pricingData';

export interface SiteSettingsData extends CompanyInfo {
  announcementBanner: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkTab: string;
  };
}

interface SiteContextType {
  settings: SiteSettingsData;
  pricingList: ServicePricing[];
  loadingSettings: boolean;
  loadingPricing: boolean;
  updateSettings: (newSettings: Partial<SiteSettingsData>) => Promise<boolean>;
  updatePricing: (newPricing: ServicePricing[]) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
  resetPricing: () => Promise<boolean>;
  refreshAll: () => Promise<void>;
}

const defaultSettings: SiteSettingsData = {
  ...companyData,
  announcementBanner: {
    enabled: true,
    text: '⚡ Available for new web, software, and digital growth projects!',
    linkText: 'Book Consultation',
    linkTab: 'contact',
  },
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingsData>(() => {
    const saved = localStorage.getItem('vexa_site_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return defaultSettings;
  });

  const [pricingList, setPricingList] = useState<ServicePricing[]>(() => {
    const saved = localStorage.getItem('vexa_pricing_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return pricingData;
  });

  const [loadingSettings, setLoadingSettings] = useState(false);
  const [loadingPricing, setLoadingPricing] = useState(false);

  // Fetch Settings from API
  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        const merged: SiteSettingsData = {
          name: d.companyName || defaultSettings.name,
          tagline: d.tagline || defaultSettings.tagline,
          description: d.description || defaultSettings.description,
          heroHeadline: d.heroHeadline || defaultSettings.heroHeadline,
          heroSubtext: d.heroSubtext || defaultSettings.heroSubtext,
          phone: d.phone || defaultSettings.phone,
          email: d.email || defaultSettings.email,
          location: d.location || defaultSettings.location,
          businessHours: d.businessHours || defaultSettings.businessHours,
          whatsappUrl: d.whatsappUrl || defaultSettings.whatsappUrl,
          socials: {
            facebook: d.socials?.facebook || defaultSettings.socials.facebook,
          },
          stats: Array.isArray(d.stats) && d.stats.length > 0 ? d.stats : defaultSettings.stats,
          announcementBanner: d.announcementBanner || defaultSettings.announcementBanner,
        };
        setSettings(merged);
        localStorage.setItem('vexa_site_settings', JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('API /api/settings unreachable, using cached settings:', err);
    } finally {
      setLoadingSettings(false);
    }
  };

  // Fetch Pricing from API
  const fetchPricing = async () => {
    setLoadingPricing(true);
    try {
      const res = await fetch('/api/pricing');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setPricingList(data.data);
        localStorage.setItem('vexa_pricing_data', JSON.stringify(data.data));
      }
    } catch (err) {
      console.warn('API /api/pricing unreachable, using cached pricing:', err);
    } finally {
      setLoadingPricing(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchPricing();
  }, []);

  // Update Settings
  const updateSettings = async (newSettings: Partial<SiteSettingsData>): Promise<boolean> => {
    const updated: SiteSettingsData = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('vexa_site_settings', JSON.stringify(updated));

    try {
      const payload = {
        companyName: updated.name,
        tagline: updated.tagline,
        heroHeadline: updated.heroHeadline,
        heroSubtext: updated.heroSubtext,
        phone: updated.phone,
        email: updated.email,
        location: updated.location,
        businessHours: updated.businessHours,
        whatsappUrl: updated.whatsappUrl,
        socials: updated.socials,
        stats: updated.stats,
        announcementBanner: updated.announcementBanner,
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return res.ok && data.success;
    } catch (err) {
      console.error('Failed to sync settings to API:', err);
      // Still saved locally
      return true;
    }
  };

  // Update Pricing
  const updatePricing = async (newPricing: ServicePricing[]): Promise<boolean> => {
    setPricingList(newPricing);
    localStorage.setItem('vexa_pricing_data', JSON.stringify(newPricing));

    try {
      const res = await fetch('/api/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPricing),
      });
      const data = await res.json();
      return res.ok && data.success;
    } catch (err) {
      console.error('Failed to sync pricing to API:', err);
      return true;
    }
  };

  // Reset Settings
  const resetSettings = async (): Promise<boolean> => {
    setSettings(defaultSettings);
    localStorage.setItem('vexa_site_settings', JSON.stringify(defaultSettings));
    try {
      await fetch('/api/settings/reset', { method: 'POST' });
      return true;
    } catch (err) {
      return true;
    }
  };

  // Reset Pricing
  const resetPricing = async (): Promise<boolean> => {
    setPricingList(pricingData);
    localStorage.setItem('vexa_pricing_data', JSON.stringify(pricingData));
    try {
      await fetch('/api/pricing/reset', { method: 'POST' });
      return true;
    } catch (err) {
      return true;
    }
  };

  const refreshAll = async () => {
    await Promise.all([fetchSettings(), fetchPricing()]);
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        pricingList,
        loadingSettings,
        loadingPricing,
        updateSettings,
        updatePricing,
        resetSettings,
        resetPricing,
        refreshAll,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
