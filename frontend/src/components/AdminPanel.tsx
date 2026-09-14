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
} from 'lucide-react';
import { ProjectItem, portfolioData } from '../data/portfolio';

interface AdminPanelProps {
  onExit: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExit }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vexa_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'inquiries' | 'newsletter' | 'system'>('projects');

  // Projects State
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('all');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [viewingInquiry, setViewingInquiry] = useState<any | null>(null);

  // Newsletter State
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);

  // System Health State
  const [healthData, setHealthData] = useState<any>(null);

  // Notification / Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin' || passwordInput === 'vexa2026' || passwordInput === '1234') {
      setIsAuthenticated(true);
      localStorage.setItem('vexa_admin_auth', 'true');
      setAuthError('');
      showToast('Welcome to VEXA IT Admin Panel');
    } else {
      setAuthError('Invalid administrator password. (Default is admin or vexa2026)');
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
        // Map backend schema to ProjectItem
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
        // Use default portfolio data if backend returned empty list
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

  // Inquiry Form State (Add More Contact Lead)
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

  // Add Photo via Local File Upload (FileReader Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      setProjectForm((prev) => ({
        ...prev,
        galleryImages: [
          ...prev.galleryImages,
          {
            url: base64Url,
            title: file.name.replace(/\.[^/.]+$/, ''),
            caption: `Uploaded image (${(file.size / 1024).toFixed(0)} KB)`,
          },
        ],
      }));
      showToast(`Uploaded ${file.name}`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Remove Photo from Project
  const handleRemovePhoto = (index: number) => {
    setProjectForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  // Save Project (Create or Update)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim() || !projectForm.shortDesc.trim()) {
      showToast('Project Name and Short Description are required', 'error');
      return;
    }

    const payload = {
      name: projectForm.name.trim(),
      slug: projectForm.slug.trim() || undefined,
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
        showToast(data.error || 'Failed to save project', 'error');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      showToast('Server error saving project', 'error');
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

  // Reset / Seed Default Projects
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

  // Save New Inquiry (Manual Lead Entry)
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
        showToast('New lead/inquiry added successfully');
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
        showToast('Inquiry status updated');
        fetchInquiries();
        if (viewingInquiry && viewingInquiry._id === id) {
          setViewingInquiry(data.data);
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
        if (viewingInquiry && viewingInquiry._id === id) {
          setViewingInquiry(null);
        }
        fetchInquiries();
      }
    } catch (err) {
      showToast('Failed to delete inquiry', 'error');
    }
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

  // -------------------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070D18] flex items-center justify-center px-4 relative overflow-hidden font-sans">
        {/* Background glow elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-md bg-[#0F172A]/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 mb-2">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">VEXA IT Admin Control</h1>
            <p className="text-sm text-slate-400">Enter administrator credentials to manage projects & inquiries</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Admin Password
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                V
              </div>
              <div>
                <span className="font-black tracking-wider text-white text-base">VEXA IT</span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-2 border border-slate-700 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-red-800/50 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-[#0A1120] border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Our Projects</span>
            <span className="ml-1 text-[10px] px-2 py-0.2 rounded-full bg-slate-900/50 border border-white/10">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Inquiries</span>
            <span className="ml-1 text-[10px] px-2 py-0.2 rounded-full bg-slate-900/50 border border-white/10">
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'newsletter'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Newsletter</span>
            <span className="ml-1 text-[10px] px-2 py-0.2 rounded-full bg-slate-900/50 border border-white/10">
              {subscribers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'system'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database & System</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* =========================================================================
            TAB 1: OUR PROJECTS
           ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
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
                      {/* Card Header / Thumbnail */}
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
            TAB 2: CONTACT INQUIRIES & LEADS
           ========================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
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
                  <option value="new">New</option>
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

              <button
                onClick={() => {
                  setInquiryForm(initialInquiryForm);
                  setIsInquiryModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Contact / Lead</span>
              </button>
            </div>

            {/* Inquiries Table / Cards */}
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
                            <span>WhatsApp</span>
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
            TAB 3: NEWSLETTER
           ========================================================================= */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Newsletter Subscribers</h3>
                <p className="text-xs text-slate-400">Total active subscribers registered in MongoDB</p>
              </div>
              <button
                onClick={fetchSubscribers}
                className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loadingSubscribers ? 'animate-spin' : ''}`} />
              </button>
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
                <p className="text-xs text-slate-400 mt-1">Users who subscribe via the website footer will be listed here.</p>
              </div>
            ) : (
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="divide-y divide-slate-800">
                  {subscribers.map((sub, idx) => (
                    <div key={sub._id || idx} className="p-4 flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-white">{sub.email}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-xs">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: SYSTEM & DATABASE DIAGNOSTICS
           ========================================================================= */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database Status</span>
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xl font-black text-white capitalize">
                    {healthData?.database?.status || 'Connected'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono truncate">{healthData?.database?.host || 'MongoDB Atlas'}</p>
              </div>

              <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database Name</span>
                <p className="text-xl font-black text-white font-mono">{healthData?.database?.name || 'vexa_it'}</p>
                <p className="text-xs text-emerald-400">Cluster 0 (Atlas)</p>
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
                  <span className="text-blue-400 font-bold">POST/GET</span>
                  <span className="text-slate-300">/api/newsletter</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL 1: ADD / EDIT PROJECT (With Photo URL / File Upload Support)
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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

              {/* Technologies & Deliverables */}
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

              {/* -------------------------------------------------------------
                  PHOTOS & GALLERY MANAGEMENT
                 ------------------------------------------------------------- */}
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

                {/* Option 1: Add via URL */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400">Option A: Add Photo by URL</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Image URL (e.g. /ape-pos/pos-1.png or https://...)"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      className="sm:col-span-2 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Title (optional)"
                      value={photoTitleInput}
                      onChange={(e) => setPhotoTitleInput(e.target.value)}
                      className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Caption / description (optional)"
                      value={photoCaptionInput}
                      onChange={(e) => setPhotoCaptionInput(e.target.value)}
                      className="flex-grow px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhotoUrl}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add URL</span>
                    </button>
                  </div>
                </div>

                {/* Option 2: Upload File */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400">Option B: Upload Local Photo File</span>
                  <label className="flex items-center justify-center gap-2 p-3 bg-slate-950/60 border border-dashed border-slate-700 rounded-xl hover:border-blue-500 text-xs text-slate-400 hover:text-white cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span>Click to choose image file from your computer</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Photo List Preview */}
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
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ADD CONTACT / LEAD (Manual Entry for "Add More")
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
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
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={inquiryForm.company}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })}
                    placeholder="Acme Corp"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Service</label>
                  <select
                    value={inquiryForm.service}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Social Media & Growth">Social Media & Growth</option>
                    <option value="POS Systems">POS Systems</option>
                    <option value="Custom Project">Custom Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Details / Inquiry Notes <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={inquiryForm.details}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, details: e.target.value })}
                  placeholder="Describe client requirements, meeting notes, or budget details..."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                <select
                  value={inquiryForm.status}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, status: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
                  <span>Save Contact Lead</span>
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
