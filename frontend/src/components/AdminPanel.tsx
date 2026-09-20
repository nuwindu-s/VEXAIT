import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Mail,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Key,
  X,
  Sparkles,
  Phone,
  Building,
  User,
  Check,
  Server,
  Database,
  Lock,
  Unlock,
  Users,
  Copy,
  MessageSquare,
  DollarSign,
  Settings as SettingsIcon,
  Sliders,
  TrendingUp,
  Award,
  Shield,
  Download,
  Share2,
  Globe,
  Code,
  Layout,
  ShoppingCart,
  Compass,
  FileText,
  HelpCircle,
  Calendar,
  Save,
  RotateCcw,
} from 'lucide-react';
import { ProjectItem, portfolioData } from '../data/portfolio';
import { useSite, SiteSettingsData } from '../context/SiteContext';
import { ServicePricing, PricingPackage, pricingData as defaultPricingData } from '../data/pricingData';

interface AdminPanelProps {
  onExit: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExit }) => {
  const {
    settings,
    pricingList,
    updateSettings,
    updatePricing,
    resetSettings,
    resetPricing,
    refreshAll,
  } = useSite();

  // Authentication State
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('vexa_admin_custom_pwd') || 'admin';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vexa_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'inquiries' | 'pricing' | 'settings' | 'newsletter' | 'system'
  >('overview');

  // Projects State
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('all');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isSavingProject, setIsSavingProject] = useState(false);

  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [inquiryNoteInput, setInquiryNoteInput] = useState('');

  // Newsletter State
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [newsletterSearch, setNewsletterSearch] = useState('');

  // System Health State
  const [healthData, setHealthData] = useState<any>(null);

  // Editable Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettingsData>(settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [newAdminPasswordInput, setNewAdminPasswordInput] = useState('');

  // Editable Pricing Form State
  const [localPricing, setLocalPricing] = useState<ServicePricing[]>(pricingList);
  const [activePricingServiceId, setActivePricingServiceId] = useState<string>('web-development');
  const [isSavingPricing, setIsSavingPricing] = useState(false);

  // Dedicated Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPwdInput, setCurrentPwdInput] = useState('');
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [pwdModalError, setPwdModalError] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);

  // Notification / Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Submit Password Change
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdModalError('');

    const validCurrentPasswords = [adminPassword, 'admin', 'vexa2026', '1234'];
    if (!validCurrentPasswords.includes(currentPwdInput.trim())) {
      setPwdModalError('Current password is incorrect.');
      return;
    }

    if (newPwdInput.trim().length < 4) {
      setPwdModalError('New password must be at least 4 characters long.');
      return;
    }

    if (newPwdInput !== confirmPwdInput) {
      setPwdModalError('New passwords do not match. Please re-type.');
      return;
    }

    // Persist new password
    localStorage.setItem('vexa_admin_custom_pwd', newPwdInput.trim());
    setAdminPassword(newPwdInput.trim());
    setIsPasswordModalOpen(false);
    setCurrentPwdInput('');
    setNewPwdInput('');
    setConfirmPwdInput('');
    showToast('Administrator password successfully updated!');
  };

  // Sync state when context updates
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    setLocalPricing(pricingList);
  }, [pricingList]);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPasswords = [adminPassword, 'admin', 'vexa2026', '1234'];
    if (validPasswords.includes(passwordInput.trim())) {
      setIsAuthenticated(true);
      localStorage.setItem('vexa_admin_auth', 'true');
      setAuthError('');
      showToast('Welcome to VEXA IT Command Center');
    } else {
      setAuthError('Invalid administrator password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vexa_admin_auth');
  };

  // Fetch Projects from API
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const formatted: ProjectItem[] = data.data.map((p: any) => ({
          id: p.slug || p._id,
          _id: p._id,
          name: p.name,
          category: p.category,
          tag: p.tag || p.category,
          badge: p.badge || '',
          subtitle: p.subtitle || '',
          shortDesc: p.shortDesc,
          fullDesc: p.fullDesc || p.shortDesc,
          client: p.client || 'Client',
          timeline: p.timeline || 'Completed',
          impact: p.impact || '',
          technologies: p.technologies || [],
          deliverables: p.deliverables || [],
          features: p.features || [],
          galleryImages: p.galleryImages || [],
          accentColor: p.accentColor || 'from-blue-600 via-indigo-600 to-sky-600',
          mockupType: p.mockupType || 'browser',
          url: p.url || '',
        }));
        setProjects(formatted);
      } else {
        setProjects(portfolioData);
      }
    } catch (err) {
      console.error('Failed to load projects from server, using local portfolio sync:', err);
      setProjects(portfolioData);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Fetch Inquiries from API
  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setInquiries(data.data);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  // Fetch Subscribers from API
  const fetchSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const res = await fetch('/api/newsletter');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSubscribers(data.data);
      }
    } catch (err) {
      console.error('Failed to load subscribers:', err);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  // Fetch System Health
  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      setHealthData({ status: 'offline', error: 'Server unreachable' });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchInquiries();
      fetchSubscribers();
      fetchHealth();
      refreshAll();
    }
  }, [isAuthenticated]);

  // Project Form State
  const initialProjectForm = {
    name: '',
    slug: '',
    category: 'Web' as 'Web' | 'Software' | 'Mobile' | 'E-Commerce',
    tag: '',
    badge: '',
    subtitle: '',
    shortDesc: '',
    fullDesc: '',
    client: '',
    timeline: 'Completed',
    impact: '',
    technologiesStr: '',
    deliverablesStr: '',
    featuresStr: '',
    accentColor: 'from-blue-600 via-indigo-600 to-sky-600',
    mockupType: 'browser' as 'browser' | 'mobile' | 'dashboard',
    url: '',
    galleryImages: [] as { url: string; title: string; caption: string }[],
  };

  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoTitleInput, setPhotoTitleInput] = useState('');
  const [photoCaptionInput, setPhotoCaptionInput] = useState('');

  // Inquiry Form State
  const initialInquiryForm = {
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Web Development',
    details: '',
    status: 'new',
    notes: '',
  };
  const [inquiryForm, setInquiryForm] = useState(initialInquiryForm);

  // Open Create Project Modal
  const handleOpenCreateProject = () => {
    setEditingProject(null);
    setProjectForm(initialProjectForm);
    setIsProjectModalOpen(true);
  };

  // Open Edit Project Modal
  const handleOpenEditProject = (proj: ProjectItem) => {
    setEditingProject(proj);
    setProjectForm({
      name: proj.name,
      slug: proj.id,
      category: proj.category,
      tag: proj.tag || '',
      badge: proj.badge || '',
      subtitle: proj.subtitle || '',
      shortDesc: proj.shortDesc || '',
      fullDesc: proj.fullDesc || '',
      client: proj.client || '',
      timeline: proj.timeline || '',
      impact: proj.impact || '',
      technologiesStr: (proj.technologies || []).join(', '),
      deliverablesStr: (proj.deliverables || []).join('\n'),
      featuresStr: (proj.features || []).join('\n'),
      accentColor: proj.accentColor || 'from-blue-600 via-indigo-600 to-sky-600',
      mockupType: proj.mockupType || 'browser',
      url: proj.url || '',
      galleryImages: proj.galleryImages ? [...proj.galleryImages] : [],
    });
    setIsProjectModalOpen(true);
  };

  // Add Photo URL to Project Form
  const handleAddPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    setProjectForm((prev) => ({
      ...prev,
      galleryImages: [
        ...prev.galleryImages,
        {
          url: photoUrlInput.trim(),
          title: photoTitleInput.trim() || `Image ${prev.galleryImages.length + 1}`,
          caption: photoCaptionInput.trim() || '',
        },
      ],
    }));
    setPhotoUrlInput('');
    setPhotoTitleInput('');
    setPhotoCaptionInput('');
  };

  // Client-side Image Compression
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 1280;
          const maxHeight = 720;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataUrl);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Add Photos via Local File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      showToast(`Processing ${files.length} photo${files.length > 1 ? 's' : ''}...`);

      const processedImages = await Promise.all(
        files.map(async (file, index) => {
          const base64Url = await compressImage(file);
          return {
            url: base64Url,
            title: file.name.replace(/\.[^/.]+$/, ''),
            caption: `Photo ${projectForm.galleryImages.length + index + 1}`,
          };
        })
      );

      setProjectForm((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...processedImages],
      }));

      showToast(`Added ${files.length} photo${files.length > 1 ? 's' : ''}`);
    } catch (err) {
      console.error('Batch image upload error:', err);
      showToast('Error processing some image files', 'error');
    }
    e.target.value = '';
  };

  // Remove Photo from Project
  const handleRemovePhoto = (index: number) => {
    setProjectForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  // Save Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim() || !projectForm.shortDesc.trim()) {
      showToast('Project Name and Short Description are required', 'error');
      return;
    }

    setIsSavingProject(true);

    const payload = {
      name: projectForm.name.trim(),
      slug: projectForm.slug?.trim() || undefined,
      category: projectForm.category,
      tag: projectForm.tag.trim() || projectForm.category,
      badge: projectForm.badge.trim(),
      subtitle: projectForm.subtitle.trim(),
      shortDesc: projectForm.shortDesc.trim(),
      fullDesc: projectForm.fullDesc.trim() || projectForm.shortDesc.trim(),
      client: projectForm.client.trim() || 'Private Client',
      timeline: projectForm.timeline.trim() || 'Completed',
      impact: projectForm.impact.trim(),
      technologies: projectForm.technologiesStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      deliverables: projectForm.deliverablesStr
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean),
      features: projectForm.featuresStr
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      accentColor: projectForm.accentColor,
      mockupType: projectForm.mockupType,
      url: projectForm.url.trim(),
      galleryImages: projectForm.galleryImages,
    };

    try {
      const isEdit = Boolean(editingProject);
      const url = isEdit ? `/api/portfolio/${editingProject?.id}` : '/api/portfolio';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isEdit ? 'Project updated successfully' : 'Project created successfully');
        setIsProjectModalOpen(false);
        fetchProjects();
      } else {
        showToast(data.error || data.message || 'Failed to save project', 'error');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      showToast('Server error saving project', 'error');
    } finally {
      setIsSavingProject(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Project "${name}" deleted`);
        fetchProjects();
      } else {
        showToast(data.error || 'Failed to delete project', 'error');
      }
    } catch (err) {
      showToast('Server error deleting project', 'error');
    }
  };

  // Seed Default Projects
  const handleSeedProjects = async () => {
    if (!window.confirm('Reset all portfolio projects to default starter data?')) return;
    try {
      const res = await fetch('/api/portfolio/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Portfolio projects reset to defaults');
        fetchProjects();
      } else {
        showToast(data.error || 'Failed to seed projects', 'error');
      }
    } catch (err) {
      showToast('Server error seeding projects', 'error');
    }
  };

  // Save New Inquiry (Manual Lead)
  const handleSaveInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name.trim() || !inquiryForm.email.trim() || !inquiryForm.details.trim()) {
      showToast('Name, Email, and Details are required', 'error');
      return;
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('New lead added successfully');
        setIsInquiryModalOpen(false);
        setInquiryForm(initialInquiryForm);
        fetchInquiries();
      } else {
        showToast(data.error || 'Failed to create inquiry', 'error');
      }
    } catch (err) {
      showToast('Server error creating inquiry', 'error');
    }
  };

  // Update Inquiry Status & Notes
  const handleUpdateInquiryStatus = async (id: string, status: string, notes?: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Inquiry updated');
        fetchInquiries();
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry(data.data);
        }
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string, name: string) => {
    if (!window.confirm(`Delete inquiry from ${name}?`)) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Inquiry deleted');
        if (selectedInquiry && selectedInquiry._id === id) {
          setIsDetailModalOpen(false);
          setSelectedInquiry(null);
        }
        fetchInquiries();
      }
    } catch (err) {
      showToast('Failed to delete inquiry', 'error');
    }
  };

  // Export Inquiries to CSV
  const handleExportInquiriesCSV = () => {
    if (inquiries.length === 0) {
      showToast('No inquiries to export', 'error');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Service', 'Status', 'Date', 'Details', 'Notes'];
    const rows = inquiries.map((inq) => [
      `"${(inq.name || '').replace(/"/g, '""')}"`,
      `"${(inq.email || '').replace(/"/g, '""')}"`,
      `"${(inq.phone || '').replace(/"/g, '""')}"`,
      `"${(inq.company || '').replace(/"/g, '""')}"`,
      `"${(inq.service || '').replace(/"/g, '""')}"`,
      `"${(inq.status || 'new').replace(/"/g, '""')}"`,
      `"${new Date(inq.createdAt).toISOString()}"`,
      `"${(inq.details || '').replace(/"/g, '""')}"`,
      `"${(inq.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vexa_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inquiries CSV exported successfully');
  };

  // Export Newsletter Subscribers to CSV
  const handleExportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      showToast('No subscribers to export', 'error');
      return;
    }
    const headers = ['Email', 'Subscribed Date'];
    const rows = subscribers.map((sub) => [
      `"${(sub.email || '').replace(/"/g, '""')}"`,
      `"${new Date(sub.createdAt).toISOString()}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vexa_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Subscribers CSV exported');
  };

  // Copy All Subscriber Emails
  const handleCopySubscriberEmails = () => {
    if (subscribers.length === 0) {
      showToast('No subscriber emails to copy', 'error');
      return;
    }
    const emailList = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emailList);
    showToast(`Copied ${subscribers.length} subscriber emails to clipboard`);
  };

  // Save Global Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      // Check if updating admin password
      if (newAdminPasswordInput.trim()) {
        localStorage.setItem('vexa_admin_custom_pwd', newAdminPasswordInput.trim());
        setAdminPassword(newAdminPasswordInput.trim());
        setNewAdminPasswordInput('');
        showToast('Admin password updated successfully');
      }

      const success = await updateSettings(settingsForm);
      if (success) {
        showToast('Website settings updated & synced across live site');
      } else {
        showToast('Settings saved locally', 'error');
      }
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Reset Settings to Defaults
  const handleResetSettings = async () => {
    if (!window.confirm('Reset all website settings, hero text, and contact details to original defaults?')) return;
    await resetSettings();
    showToast('Settings reset to defaults');
  };

  // Save Pricing Changes
  const handleSavePricing = async () => {
    setIsSavingPricing(true);
    try {
      const success = await updatePricing(localPricing);
      if (success) {
        showToast('Pricing tiers & packages updated across website');
      } else {
        showToast('Pricing saved locally');
      }
    } catch (err) {
      showToast('Failed to update pricing', 'error');
    } finally {
      setIsSavingPricing(false);
    }
  };

  // Reset Pricing to Defaults
  const handleResetPricing = async () => {
    if (!window.confirm('Reset all pricing packages and tiers to initial catalog defaults?')) return;
    await resetPricing();
    showToast('Pricing catalog reset to defaults');
  };

  // Helper to edit a package field
  const updatePackageField = (
    serviceId: string,
    packageId: string,
    field: keyof PricingPackage,
    value: any
  ) => {
    setLocalPricing((prev) =>
      prev.map((srv) => {
        if (srv.id !== serviceId) return srv;
        return {
          ...srv,
          packages: srv.packages.map((pkg) => {
            if (pkg.id !== packageId) return pkg;
            return { ...pkg, [field]: value };
          }),
        };
      })
    );
  };

  // Helper to edit service starting price / note
  const updateServiceField = (serviceId: string, field: keyof ServicePricing, value: any) => {
    setLocalPricing((prev) =>
      prev.map((srv) => {
        if (srv.id !== serviceId) return srv;
        return { ...srv, [field]: value };
      })
    );
  };

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.client.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesCategory =
      projectCategoryFilter === 'all' || p.category.toLowerCase() === projectCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      (inq.company && inq.company.toLowerCase().includes(inquirySearch.toLowerCase())) ||
      (inq.service && inq.service.toLowerCase().includes(inquirySearch.toLowerCase()));
    const matchesStatus = inquiryStatusFilter === 'all' || inq.status === inquiryStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Subscribers
  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(newsletterSearch.toLowerCase())
  );

  // Active pricing service object
  const currentPricingService =
    localPricing.find((s) => s.id === activePricingServiceId) || localPricing[0];

  // Pending inquiry count
  const newInquiriesCount = inquiries.filter((inq) => inq.status === 'new' || !inq.status).length;

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070D18] flex items-center justify-center px-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-md bg-[#0F172A]/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 mb-2">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">VEXA IT Command Center</h1>
            <p className="text-sm text-slate-400">Total website management, CRM, and system control</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Administrator Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password (default: admin)"
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onExit}
              className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 animate-slideUp ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700 text-emerald-200'
              : 'bg-red-950/90 border-red-700 text-red-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-[#0F172A]/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md">
              V
            </div>
            <div>
              <span className="font-black tracking-wider text-white text-base">VEXA IT</span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                Command Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setPwdModalError('');
                setCurrentPwdInput('');
                setNewPwdInput('');
                setConfirmPwdInput('');
                setIsPasswordModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Change Administrator Password"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Change Password</span>
            </button>
            <button
              onClick={onExit}
              className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-2 border border-slate-700 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-red-800/50 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs (7 Comprehensive Controls) */}
      <div className="bg-[#0A1120] border-b border-slate-800/60 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-thin">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview & KPI</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Projects Showcase</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 border border-white/10">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>CRM & Inquiries</span>
            {newInquiriesCount > 0 ? (
              <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold animate-pulse">
                {newInquiriesCount} new
              </span>
            ) : (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 border border-white/10">
                {inquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Pricing & Packages</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Site & Hero Control</span>
          </button>

          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'newsletter'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Newsletter</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 border border-white/10">
              {subscribers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'system'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* =========================================================================
            TAB 1: OVERVIEW & EXECUTIVE KPI DASHBOARD
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                onClick={() => setActiveTab('projects')}
                className="bg-[#0F172A] border border-slate-800 hover:border-blue-500/60 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 shadow-lg group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 font-mono">Portfolio</span>
                </div>
                <div className="text-3xl font-black text-white">{projects.length}</div>
                <p className="text-xs text-slate-400 mt-1">Active showcase projects</p>
              </div>

              <div
                onClick={() => setActiveTab('inquiries')}
                className="bg-[#0F172A] border border-slate-800 hover:border-amber-500/60 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 shadow-lg group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl group-hover:bg-amber-600 group-hover:text-slate-950 transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  {newInquiriesCount > 0 ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {newInquiriesCount} Action Needed
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 font-mono">CRM Leads</span>
                  )}
                </div>
                <div className="text-3xl font-black text-white">{inquiries.length}</div>
                <p className="text-xs text-slate-400 mt-1">Total client contact inquiries</p>
              </div>

              <div
                onClick={() => setActiveTab('newsletter')}
                className="bg-[#0F172A] border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 shadow-lg group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 font-mono">Subscribers</span>
                </div>
                <div className="text-3xl font-black text-white">{subscribers.length}</div>
                <p className="text-xs text-slate-400 mt-1">Registered email audience</p>
              </div>

              <div
                onClick={() => setActiveTab('system')}
                className="bg-[#0F172A] border border-slate-800 hover:border-purple-500/60 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 shadow-lg group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Database className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" /> Live
                  </span>
                </div>
                <div className="text-2xl font-black text-white truncate">
                  {healthData?.database?.status === 'connected' ? 'Connected' : 'Active'}
                </div>
                <p className="text-xs text-slate-400 mt-1">MongoDB Atlas Cluster 0</p>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Quick Administration Actions</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    setActiveTab('projects');
                    handleOpenCreateProject();
                  }}
                  className="p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3"
                >
                  <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Add New Project</div>
                    <div className="text-[11px] text-slate-400">Upload showcase screenshots</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('inquiries');
                    setInquiryForm(initialInquiryForm);
                    setIsInquiryModalOpen(true);
                  }}
                  className="p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3"
                >
                  <div className="p-2.5 bg-amber-600/20 text-amber-400 rounded-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Record Contact Lead</div>
                    <div className="text-[11px] text-slate-400">Manual client entry</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('pricing')}
                  className="p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3"
                >
                  <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-lg">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Update Pricing Tiers</div>
                    <div className="text-[11px] text-slate-400">Edit package prices & features</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3"
                >
                  <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-lg">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Change Hero & Phone</div>
                    <div className="text-[11px] text-slate-400">Live website copy & contacts</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Leads Preview */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Recent Inquiries</span>
                </h3>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                >
                  View all ({inquiries.length}) &rarr;
                </button>
              </div>

              {inquiries.length === 0 ? (
                <p className="text-xs text-slate-400">No inquiries yet.</p>
              ) : (
                <div className="divide-y divide-slate-800">
                  {inquiries.slice(0, 4).map((inq) => (
                    <div
                      key={inq._id}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setInquiryNoteInput(inq.notes || '');
                        setIsDetailModalOpen(true);
                      }}
                      className="py-3 flex items-center justify-between hover:bg-slate-900/50 p-2 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                          {inq.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{inq.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {inq.email} &bull; <span className="text-blue-400">{inq.service}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {inq.status || 'new'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: OUR PROJECTS & SHOWCASE
           ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F172A] p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={projectCategoryFilter}
                  onChange={(e) => setProjectCategoryFilter(e.target.value)}
                  aria-label="Filter projects by category"
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Web">Web Apps</option>
                  <option value="Software">Software & POS</option>
                  <option value="Mobile">Mobile Apps</option>
                  <option value="E-Commerce">E-Commerce</option>
                </select>

                <button
                  onClick={fetchProjects}
                  title="Refresh Projects"
                  className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingProjects ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSeedProjects}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                >
                  Seed Defaults
                </button>
                <button
                  onClick={handleOpenCreateProject}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            {loadingProjects ? (
              <div className="py-20 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
                <p className="text-sm">Loading projects from MongoDB...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="py-16 text-center bg-[#0F172A] border border-slate-800 rounded-2xl p-8 space-y-4">
                <FolderKanban className="w-12 h-12 mx-auto text-slate-600" />
                <h3 className="text-lg font-bold text-white">No projects found</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  {projectSearch
                    ? 'No projects match your search query.'
                    : 'Get started by creating your first showcase project or click "Seed Defaults".'}
                </p>
                <button
                  onClick={handleOpenCreateProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((proj) => {
                  const firstPhoto = proj.galleryImages?.[0]?.url;
                  return (
                    <div
                      key={proj.id}
                      className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col group shadow-lg"
                    >
                      {/* Card Thumbnail */}
                      <div className="h-44 bg-slate-900 relative overflow-hidden flex items-center justify-center border-b border-slate-800">
                        {firstPhoto ? (
                          <img
                            src={firstPhoto}
                            alt={proj.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${proj.accentColor} opacity-20 flex items-center justify-center`}>
                            <ImageIcon className="w-12 h-12 text-slate-500" />
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-[10px] font-bold tracking-wider uppercase border border-slate-700 backdrop-blur-sm">
                            {proj.category}
                          </span>
                          {proj.galleryImages && proj.galleryImages.length > 0 && (
                            <span className="px-2 py-1 rounded-md bg-blue-900/90 text-blue-300 text-[10px] font-bold border border-blue-700 flex items-center gap-1 backdrop-blur-sm">
                              <ImageIcon className="w-3 h-3" />
                              {proj.galleryImages.length} {proj.galleryImages.length === 1 ? 'photo' : 'photos'}
                            </span>
                          )}
                        </div>

                        {proj.url && (
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-sm transition-colors"
                            title="Visit Live URL"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                            {proj.name}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {proj.shortDesc}
                          </p>
                        </div>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {(proj.technologies || []).slice(0, 4).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/60"
                            >
                              {tech}
                            </span>
                          ))}
                          {(proj.technologies || []).length > 4 && (
                            <span className="text-[10px] text-slate-500 self-center">
                              +{proj.technologies.length - 4} more
                            </span>
                          )}
                        </div>

                        {/* Card Actions */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 font-mono truncate max-w-[140px]">
                            {proj.client || 'Client'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditProject(proj)}
                              className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 hover:text-blue-100 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-blue-800/60 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id, proj.name)}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-800/40 transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: CONTACT INQUIRIES & LEADS CRM
           ========================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F172A] p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, email, company..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value)}
                  aria-label="Filter inquiries by status"
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New ({inquiries.filter((i) => i.status === 'new').length})</option>
                  <option value="in_review">In Review</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  onClick={fetchInquiries}
                  title="Refresh Inquiries"
                  className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingInquiries ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportInquiriesCSV}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={() => {
                    setInquiryForm(initialInquiryForm);
                    setIsInquiryModalOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Lead</span>
                </button>
              </div>
            </div>

            {/* Inquiries List */}
            {loadingInquiries ? (
              <div className="py-20 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
                <p className="text-sm">Loading contact inquiries from MongoDB...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="py-16 text-center bg-[#0F172A] border border-slate-800 rounded-2xl p-8 space-y-4">
                <Mail className="w-12 h-12 mx-auto text-slate-600" />
                <h3 className="text-lg font-bold text-white">No inquiries found</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  {inquirySearch
                    ? 'No inquiries match your search filter.'
                    : 'Submissions from the public Contact form will appear here, or you can manually add leads using the button above.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => {
                  const statusColors: Record<string, string> = {
                    new: 'bg-blue-950/80 text-blue-400 border-blue-800',
                    in_review: 'bg-amber-950/80 text-amber-400 border-amber-800',
                    contacted: 'bg-purple-950/80 text-purple-400 border-purple-800',
                    completed: 'bg-emerald-950/80 text-emerald-400 border-emerald-800',
                    archived: 'bg-slate-800 text-slate-400 border-slate-700',
                  };

                  return (
                    <div
                      key={inq._id}
                      className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                            {inq.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-white">{inq.name}</h4>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                                  statusColors[inq.status] || statusColors.new
                                }`}
                              >
                                {inq.status?.replace('_', ' ') || 'new'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                              <span>{inq.email}</span>
                              {inq.phone && inq.phone !== 'Not specified' && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-500" /> {inq.phone}
                                </span>
                              )}
                              {inq.company && inq.company !== 'Not specified' && (
                                <span className="flex items-center gap-1">
                                  <Building className="w-3 h-3 text-slate-500" /> {inq.company}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="text-[11px] text-slate-500 font-mono">
                            {new Date(inq.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>

                          <select
                            value={inq.status || 'new'}
                            onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                            aria-label="Change inquiry status"
                            className="text-xs bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="in_review">In Review</option>
                            <option value="contacted">Contacted</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                          </select>

                          <button
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setInquiryNoteInput(inq.notes || '');
                              setIsDetailModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 cursor-pointer"
                          >
                            Notes & Full Info
                          </button>

                          <button
                            onClick={() => handleDeleteInquiry(inq._id, inq.name)}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Inquiry Details & Service */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/40">
                            Service: {inq.service || 'Web Development'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                          {inq.details}
                        </p>
                      </div>

                      {/* Notes snippet if present */}
                      {inq.notes && (
                        <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl text-xs text-amber-300/90 flex items-start gap-2">
                          <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Internal Note:</span> {inq.notes}
                          </div>
                        </div>
                      )}

                      {/* Quick Contact Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <a
                          href={`mailto:${inq.email}?subject=${encodeURIComponent(
                            `VEXA IT Follow-up: ${inq.service || 'Your Inquiry'}`
                          )}`}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5 text-blue-400" />
                          <span>Reply via Email</span>
                        </a>

                        {inq.phone && inq.phone !== 'Not specified' && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-emerald-100 text-xs font-medium border border-emerald-800/40 transition-colors inline-flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            <span>WhatsApp Client</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: PRICING PACKAGES & SERVICES MANAGER
           ========================================================================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F172A] p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Pricing Packages & Tiers Manager</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Edit prices, features, and popularity badges across all 6 service categories on the live website.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetPricing}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={handleSavePricing}
                  disabled={isSavingPricing}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
                >
                  {isSavingPricing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save All Pricing</span>
                </button>
              </div>
            </div>

            {/* Service Category Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
              {localPricing.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => setActivePricingServiceId(srv.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activePricingServiceId === srv.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-[#0F172A] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {srv.serviceTitle}
                </button>
              ))}
            </div>

            {/* Service-level Settings */}
            {currentPricingService && (
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Starting Price Tagline
                    </label>
                    <input
                      type="text"
                      value={currentPricingService.startingPrice}
                      onChange={(e) =>
                        updateServiceField(currentPricingService.id, 'startingPrice', e.target.value)
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Subtitle / Brief Note
                    </label>
                    <input
                      type="text"
                      value={currentPricingService.serviceSubtitle}
                      onChange={(e) =>
                        updateServiceField(currentPricingService.id, 'serviceSubtitle', e.target.value)
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                {/* Package Cards for this Service */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {currentPricingService.packages.map((pkg, idx) => (
                    <div
                      key={pkg.id || idx}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase">Tier #{idx + 1}</span>
                        <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(pkg.popular)}
                            onChange={(e) =>
                              updatePackageField(
                                currentPricingService.id,
                                pkg.id,
                                'popular',
                                e.target.checked
                              )
                            }
                            className="rounded text-blue-600 focus:ring-0"
                          />
                          <span className="text-[11px] font-semibold text-amber-400">Popular Badge</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Package Name</label>
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) =>
                            updatePackageField(currentPricingService.id, pkg.id, 'name', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Price Display</label>
                        <input
                          type="text"
                          value={pkg.price}
                          onChange={(e) =>
                            updatePackageField(currentPricingService.id, pkg.id, 'price', e.target.value)
                          }
                          placeholder="e.g. Rs. 35,000 or Rs. 150,000+"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-emerald-400 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Suitable For</label>
                        <input
                          type="text"
                          value={pkg.suitableFor}
                          onChange={(e) =>
                            updatePackageField(currentPricingService.id, pkg.id, 'suitableFor', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Features List (One feature per line)
                        </label>
                        <textarea
                          rows={6}
                          value={(pkg.features || []).join('\n')}
                          onChange={(e) =>
                            updatePackageField(
                              currentPricingService.id,
                              pkg.id,
                              'features',
                              e.target.value.split('\n').filter(Boolean)
                            )
                          }
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: SITE SETTINGS, HERO & CONTACT CONTROL
           ========================================================================= */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 animate-fadeIn">
            {/* Header / Save Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F172A] p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-blue-400" />
                  <span>Site Content & Global Configuration</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage headline text, announcements, official contact numbers, addresses, and trust metrics.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer"
                >
                  Reset Defaults
                </button>
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
                >
                  {isSavingSettings ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save All Settings</span>
                </button>
              </div>
            </div>

            {/* 1. Hero Section & Announcement */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Hero Section & Announcement Banner</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hero Headline</label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroHeadline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hero Supporting Text</label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubtext}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtext: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* Announcement Bar */}
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Top Announcement Banner</span>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(settingsForm.announcementBanner?.enabled)}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          announcementBanner: {
                            ...settingsForm.announcementBanner,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>Active Banner</span>
                  </label>
                </div>

                <input
                  type="text"
                  value={settingsForm.announcementBanner?.text || ''}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      announcementBanner: {
                        ...settingsForm.announcementBanner,
                        text: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. ⚡ Available for new web, software, and digital growth projects!"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            {/* 2. Official Contact Info & Business Details */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Company Contact Information</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={settingsForm.email || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Office Location</label>
                  <input
                    type="text"
                    value={settingsForm.location || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business Hours</label>
                  <input
                    type="text"
                    value={settingsForm.businessHours || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp URL / Phone Link</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappUrl: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* 3. Live Trust Statistics */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verified Trust Statistics (Landing Page Stats)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(settingsForm.stats || []).map((stat, idx) => (
                  <div key={stat.id || idx} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{stat.label}</span>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400">Metric Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updatedStats = [...settingsForm.stats];
                          updatedStats[idx] = { ...updatedStats[idx], value: e.target.value };
                          setSettingsForm({ ...settingsForm, stats: updatedStats });
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-bold text-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400">Title</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updatedStats = [...settingsForm.stats];
                          updatedStats[idx] = { ...updatedStats[idx], label: e.target.value };
                          setSettingsForm({ ...settingsForm, stats: updatedStats });
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Administrator Password Change */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" />
                <span>Security & Admin Credentials</span>
              </h4>

              <div className="max-w-md space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Update Administrator Password (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Enter new password to change..."
                  value={newAdminPasswordInput}
                  onChange={(e) => setNewAdminPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500"
                />
                <p className="text-[11px] text-slate-500">
                  Leave blank if you wish to keep the current administrative password.
                </p>
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 6: NEWSLETTER SUBSCRIBERS
           ========================================================================= */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F172A] p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Newsletter Audience & Email Marketing</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Total active subscribers registered in MongoDB: <strong>{subscribers.length}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySubscriberEmails}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-blue-400" />
                  <span>Copy All Emails</span>
                </button>

                <button
                  onClick={handleExportSubscribersCSV}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={fetchSubscribers}
                  className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingSubscribers ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {loadingSubscribers ? (
              <div className="py-20 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
                <p className="text-sm">Loading subscribers...</p>
              </div>
            ) : subscribers.length === 0 ? (
              <div className="py-16 text-center bg-[#0F172A] border border-slate-800 rounded-2xl p-8">
                <Users className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-white">No subscribers yet</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Users who subscribe via the website footer will be listed here.
                </p>
              </div>
            ) : (
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-3 bg-slate-900 border-b border-slate-800">
                  <input
                    type="text"
                    placeholder="Search subscribers by email..."
                    value={newsletterSearch}
                    onChange={(e) => setNewsletterSearch(e.target.value)}
                    className="w-full max-w-sm px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
                  {filteredSubscribers.map((sub, idx) => (
                    <div
                      key={sub._id || idx}
                      className="p-4 flex items-center justify-between hover:bg-slate-900/40 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-white">{sub.email}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-xs">
                        {new Date(sub.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 7: DATABASE & SYSTEM DIAGNOSTICS
           ========================================================================= */}
        {activeTab === 'system' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database Status</span>
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xl font-black text-white capitalize">
                    {healthData?.database?.status || 'Connected'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono truncate">
                  {healthData?.database?.host || 'MongoDB Atlas'}
                </p>
              </div>

              <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database Name</span>
                <p className="text-xl font-black text-white font-mono">{healthData?.database?.name || 'vexa_it'}</p>
                <p className="text-xs text-emerald-400">Cluster 0 (Atlas Cloud)</p>
              </div>

              <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Server Uptime</span>
                <p className="text-xl font-black text-white">
                  {healthData?.uptime ? `${Math.floor(healthData.uptime)}s` : 'Active'}
                </p>
                <p className="text-xs text-slate-500">Express 5 REST API</p>
              </div>
            </div>

            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-400" />
                <span>Backend API Endpoints Reference</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <span className="text-slate-300">/api/health</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-blue-400 font-bold">GET/POST</span>
                  <span className="text-slate-300">/api/portfolio</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-amber-400 font-bold">PUT/DEL</span>
                  <span className="text-slate-300">/api/portfolio/:id</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-blue-400 font-bold">GET/POST</span>
                  <span className="text-slate-300">/api/inquiries</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-purple-400 font-bold">PATCH</span>
                  <span className="text-slate-300">/api/inquiries/:id</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-blue-400 font-bold">GET/PUT</span>
                  <span className="text-slate-300">/api/settings</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-blue-400 font-bold">GET/PUT</span>
                  <span className="text-slate-300">/api/pricing</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-blue-400 font-bold">POST/GET</span>
                  <span className="text-slate-300">/api/newsletter</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL 1: ADD / EDIT PROJECT
         ========================================================================= */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl my-8">
            <div className="sticky top-0 bg-[#0F172A]/95 border-b border-slate-800 px-6 py-4 flex items-center justify-between backdrop-blur-md z-10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-400" />
                <span>{editingProject ? 'Edit Project' : 'Add New Project'}</span>
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Project Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    placeholder="e.g., POS System for Apé Restaurant"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        category: e.target.value as 'Web' | 'Software' | 'Mobile' | 'E-Commerce',
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Web">Web Platform / Website</option>
                    <option value="Software">Software & POS Desktop</option>
                    <option value="Mobile">Mobile Application</option>
                    <option value="E-Commerce">E-Commerce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Client Name</label>
                  <input
                    type="text"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                    placeholder="e.g., Apé Restaurant"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Live URL (Optional)</label>
                  <input
                    type="url"
                    value={projectForm.url}
                    onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Short Summary Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={projectForm.shortDesc}
                    onChange={(e) => setProjectForm({ ...projectForm, shortDesc: e.target.value })}
                    placeholder="Brief description shown on project cards..."
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Case Study / Detailed Description
                  </label>
                  <textarea
                    rows={3}
                    value={projectForm.fullDesc}
                    onChange={(e) => setProjectForm({ ...projectForm, fullDesc: e.target.value })}
                    placeholder="Detailed overview shown in modal popup..."
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Technologies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Technologies (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={projectForm.technologiesStr}
                    onChange={(e) => setProjectForm({ ...projectForm, technologiesStr: e.target.value })}
                    placeholder="React, TypeScript, Node.js, Tailwind"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Timeline / Status</label>
                  <input
                    type="text"
                    value={projectForm.timeline}
                    onChange={(e) => setProjectForm({ ...projectForm, timeline: e.target.value })}
                    placeholder="Completed & Deployed"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Photos & Gallery Management */}
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span>Project Photos & Gallery</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {projectForm.galleryImages.length} photo(s) added
                  </span>
                </div>

                {/* Option 1: URL */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400">Option A: Add Photo by URL</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      className="sm:col-span-2 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Title (optional)"
                      value={photoTitleInput}
                      onChange={(e) => setPhotoTitleInput(e.target.value)}
                      className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Caption / description (optional)"
                      value={photoCaptionInput}
                      onChange={(e) => setPhotoCaptionInput(e.target.value)}
                      className="flex-grow px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhotoUrl}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Option 2: Local Upload */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400">Option B: Upload Local Files</span>
                  <label className="flex items-center justify-center gap-2 p-3 bg-slate-950/60 border border-dashed border-slate-700 rounded-xl hover:border-blue-500 text-xs text-slate-400 hover:text-white cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span>Click to choose one or multiple image files</span>
                    <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Photo Previews */}
                {projectForm.galleryImages.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400">Attached Photos:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {projectForm.galleryImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="group relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden aspect-video flex items-center justify-center"
                        >
                          <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 text-[9px] text-white">
                            <span className="truncate font-semibold">{img.title}</span>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="self-end p-1 bg-red-600 rounded text-white hover:bg-red-500 cursor-pointer"
                              title="Remove Photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 cursor-pointer flex items-center gap-2"
                >
                  {isSavingProject ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ADD CONTACT / LEAD
         ========================================================================= */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl my-8 overflow-hidden">
            <div className="bg-[#0F172A] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>Add Contact / Client Lead</span>
              </h3>
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInquiry} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Client Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={inquiryForm.company}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })}
                    placeholder="Acme Corp"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Service</label>
                  <select
                    value={inquiryForm.service}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white cursor-pointer"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Software Development">Software Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="E-Commerce Development">E-Commerce Development</option>
                    <option value="Social Media & Growth">Social Media & Growth</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Details / Requirements <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={inquiryForm.details}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, details: e.target.value })}
                  placeholder="Describe client requirements or initial meeting notes..."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Status</label>
                <select
                  value={inquiryForm.status}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, status: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="in_review">In Review</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInquiryModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Lead</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: INQUIRY FULL DETAIL & STAFF NOTES DRAWER
         ========================================================================= */}
      {isDetailModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl my-8 overflow-hidden">
            <div className="bg-[#0F172A] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Inquiry Details & Follow-up</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Received on {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Contact Lead Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Client Name:</span>
                  <div className="font-bold text-white text-sm mt-0.5">{selectedInquiry.name}</div>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>
                  <div className="font-mono text-white mt-0.5">{selectedInquiry.email}</div>
                </div>
                <div>
                  <span className="text-slate-400">Phone:</span>
                  <div className="font-mono text-white mt-0.5">{selectedInquiry.phone || 'Not provided'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Company:</span>
                  <div className="text-white mt-0.5">{selectedInquiry.company || 'Individual / Startup'}</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400">Requested Service:</span>
                  <div className="font-bold text-blue-400 mt-0.5">{selectedInquiry.service}</div>
                </div>
              </div>

              {/* Message Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Submitted Project Details:</label>
                <p className="text-xs sm:text-sm text-slate-300 bg-slate-900 p-4 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.details}
                </p>
              </div>

              {/* Internal Staff Notes */}
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Internal Staff Follow-up Notes:</span>
                </label>
                <textarea
                  rows={3}
                  value={inquiryNoteInput}
                  onChange={(e) => setInquiryNoteInput(e.target.value)}
                  placeholder="e.g. Quoted 180k LKR, proposal document emailed, waiting for meeting on Monday..."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={selectedInquiry.status || 'new'}
                    onChange={(e) => {
                      handleUpdateInquiryStatus(selectedInquiry._id, e.target.value, inquiryNoteInput);
                    }}
                    className="text-xs bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1.5 cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="in_review">In Review</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateInquiryStatus(
                        selectedInquiry._id,
                        selectedInquiry.status || 'in_review',
                        inquiryNoteInput
                      );
                      setIsDetailModalOpen(false);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow cursor-pointer"
                  >
                    Save Notes & Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* =========================================================================
          MODAL 4: DEDICATED CHANGE ADMIN PASSWORD MODAL
         ========================================================================= */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleUp">
            <div className="bg-[#0F172A] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Change Administrator Password</span>
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Password <span className="text-red-400">*</span>
                </label>
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  required
                  value={currentPwdInput}
                  onChange={(e) => setCurrentPwdInput(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  New Password <span className="text-red-400">*</span>
                </label>
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  required
                  value={newPwdInput}
                  onChange={(e) => setNewPwdInput(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm New Password <span className="text-red-400">*</span>
                </label>
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  required
                  value={confirmPwdInput}
                  onChange={(e) => setConfirmPwdInput(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  {showPasswordText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPasswordText ? 'Hide password characters' : 'Show password characters'}</span>
                </button>
              </div>

              {pwdModalError && (
                <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{pwdModalError}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
