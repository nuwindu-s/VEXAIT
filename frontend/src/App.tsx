import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Services } from './components/Services';
import { About } from './components/About';
import { Process } from './components/Process';
import { Projects } from './components/Projects';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CTA } from './components/CTA';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { NotFound } from './components/NotFound';
import { AdminPanel } from './components/AdminPanel';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedService, setSelectedService] = useState<string>('Web Development');
  const [is404, setIs404] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return (
      window.location.pathname === '/admin' ||
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#admin'
    );
  });

  useEffect(() => {
    const handleLocation = () => {
      const isCurrentAdmin =
        window.location.pathname === '/admin' ||
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#admin';

      setIsAdmin(isCurrentAdmin);

      if (isCurrentAdmin) return;

      const hash = window.location.hash.replace('#', '').toLowerCase() as TabType;
      const validTabs: TabType[] = ['home', 'about', 'services', 'projects', 'process', 'contact'];
      
      // Handle legacy #portfolio redirects
      if (window.location.hash === '#portfolio') {
        setActiveTab('projects');
        window.location.hash = 'projects';
        return;
      }

      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('page') === '404' || window.location.pathname === '/404') {
      setIs404(true);
    } else {
      handleLocation();
    }

    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, []);

  const switchTab = (tab: TabType, servicePrefill?: string) => {
    setIsAdmin(false);
    if (servicePrefill) {
      setSelectedService(servicePrefill);
    }
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdmin) {
    return (
      <AdminPanel
        onExit={() => {
          window.history.pushState({}, '', '/');
          setIsAdmin(false);
          switchTab('home');
        }}
      />
    );
  }

  if (is404) {
    return (
      <NotFound
        onBackToHome={() => {
          window.history.pushState({}, '', '/');
          setIs404(false);
          switchTab('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. STICKY NAVIGATION BAR WITH TABS */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => switchTab(tab)}
      />

      <main className="flex-grow">
        {/* =========================================================================
            TAB 1: HOME (Clean, streamlined, uncluttered)
           ========================================================================= */}
        {activeTab === 'home' && (
          <div className="animate-fadeIn">
            {/* Hero Section */}
            <Hero
              onStartProjectClick={() => switchTab('contact')}
              onExploreServicesClick={() => switchTab('services')}
            />

            {/* Why Vexa IT / Trust Metrics */}
            <Stats />

            {/* Why Businesses Choose Vexa IT */}
            <WhyChooseUs />

            {/* CTA Section */}
            <CTA
              onStartProjectClick={() => switchTab('contact')}
              onContactClick={() => switchTab('contact')}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 2: ABOUT
           ========================================================================= */}
        {activeTab === 'about' && (
          <div className="animate-fadeIn">
            <About
              isStandalone={true}
              onStartProjectClick={() => switchTab('contact')}
            />
            <WhyChooseUs />
            <CTA
              onStartProjectClick={() => switchTab('contact')}
              onContactClick={() => switchTab('contact')}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 3: SERVICES
           ========================================================================= */}
        {activeTab === 'services' && (
          <div className="animate-fadeIn">
            <Services
              isStandalone={true}
              onSelectService={(service) => switchTab('contact', service)}
            />
            <CTA
              onStartProjectClick={() => switchTab('contact')}
              onContactClick={() => switchTab('contact')}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 4: PROJECTS (formerly Portfolio)
           ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="animate-fadeIn">
            <Projects
              isStandalone={true}
              onSelectService={(service) => switchTab('contact', service)}
            />
            <CTA
              onStartProjectClick={() => switchTab('contact')}
              onContactClick={() => switchTab('contact')}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 5: PROCESS
           ========================================================================= */}
        {activeTab === 'process' && (
          <div className="animate-fadeIn">
            <Process
              isStandalone={true}
              onStartProjectClick={() => switchTab('contact')}
            />
            <CTA
              onStartProjectClick={() => switchTab('contact')}
              onContactClick={() => switchTab('contact')}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 6: CONTACT
           ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="animate-fadeIn">
            <Contact
              isStandalone={true}
              initialService={selectedService}
            />
          </div>
        )}
      </main>

      {/* 11. FOOTER */}
      <Footer
        onTabChange={(tab) => switchTab(tab)}
        onSelectService={(service) => switchTab('contact', service)}
      />
    </div>
  );
};

export default App;
