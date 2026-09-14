export const initialProjects = [
  {
    slug: "ape-restaurant-pos",
    name: "POS System for Apé Restaurant",
    category: "Software",
    tag: "Desktop Windows Application",
    badge: "ELECTRON / REACT",
    subtitle: "Desktop Windows Application",
    shortDesc: "Offline-capable Windows desktop POS application engineered for rapid order taking, table management, role-based staff access, and multi-format business financial reporting.",
    fullDesc: "A dedicated point-of-sale desktop application engineered for Apé Restaurant. Built with Electron, React, HTML, CSS, and JavaScript, the application operates with full offline capabilities via persistent local storage. It delivers seamless order processing, interactive menu and catalog editing via CSV, staff access control with role-based permissions, and automated sales reporting with instant exports to CSV, TXT, and PDF documents.",
    client: "Apé Restaurant",
    timeline: "Completed & Deployed",
    impact: "100% Offline Resilience, Sub-Second Checkout & Instant Export Engine",
    technologies: [
      "Electron",
      "React",
      "JavaScript (ES6+)",
      "HTML5 / CSS3",
      "Local Storage (Offline Engine)",
      "CSV & Text Export",
      "PDF Report Generator"
    ],
    deliverables: [
      "Installable Windows desktop application (.exe) with custom UI",
      "Real-time order taking terminal with live cart calculations",
      "Dynamic menu management and bulk CSV import/export module",
      "Comprehensive orders dashboard with transaction voiding and audit log",
      "Financial analytics engine with daily revenue and hourly trend breakdown",
      "Role-based staff authentication and access permission controller"
    ],
    accentColor: "from-orange-600 via-amber-600 to-red-600",
    mockupType: "dashboard",
    features: [
      "Built an installable Windows desktop POS app for handling orders, cart management, and checkout.",
      "Included admin features for staff/user access, menu management, and order tracking.",
      "Supported business reporting with revenue views and export options like CSV, TXT, and PDF.",
      "Developed using Electron, React, HTML, CSS, and JS, utilizing local storage for offline capabilities."
    ],
    galleryImages: [
      {
        url: "/ape-pos/pos-7.png",
        title: "Order Desk & Cashier Terminal",
        caption: "Real-time order taking interface with quick search (Ctrl+K), category filters (Coffee, Pastry), and interactive live cart checkout."
      },
      {
        url: "/ape-pos/pos-1.png",
        title: "Management Overview Dashboard",
        caption: "Centralized operational KPI dashboard tracking total daily revenue, orders placed, registered customers, and active staff."
      },
      {
        url: "/ape-pos/pos-2.png",
        title: "Menu Editor & CSV Configurator",
        caption: "Dynamic menu item catalog supporting manual item creation, CSV template downloads, and bulk menu uploads."
      },
      {
        url: "/ape-pos/pos-3.png",
        title: "Orders Dashboard & Transaction History",
        caption: "Detailed chronological log of orders, cashier attribution, payment breakdown (Cash / Bank Transfer), and CSV report downloads."
      },
      {
        url: "/ape-pos/pos-4.png",
        title: "Revenue Dashboard & Financial Adjustments",
        caption: "Accumulated daily revenue tracking, hourly sales distribution trends, and financial summary report exports in .txt format."
      },
      {
        url: "/ape-pos/pos-6.png",
        title: "Staff Accounts Controller",
        caption: "Role-based access management with tiered permissions (Admin / Staff), credential management, and user auditing."
      },
      {
        url: "/ape-pos/pos-5.png",
        title: "Authentication & Login Portal",
        caption: "Secure authentication screen for restaurant staff and administrators with persistent offline session caching."
      }
    ],
    isFeatured: true,
    order: 1
  },
  {
    slug: "nexora-recovery",
    name: "Nexora Car Recovery & Flatbed Towing Service",
    category: "Web",
    tag: "Smart Vehicle Recovery Platform",
    badge: "WEB PLATFORM",
    subtitle: "Commercial Vehicle Recovery Platform",
    shortDesc: "Provides a modern digital platform for requesting fast and reliable vehicle towing and roadside assistance services across Sri Lanka with a user-friendly interface.",
    fullDesc: "Nexora Car Recovery is a full-featured commercial vehicle breakdown and roadside assistance digital platform designed for 24/7 rapid dispatch across Sri Lanka. Built with pure Vanilla HTML5, CSS3, and JavaScript, the platform guarantees sub-second load times, mobile accessibility, auto-GPS location capture, and frictionless WhatsApp dispatch booking without external framework overhead.",
    client: "Nexora Car Recovery & Flatbed Towing Service (Sri Lanka)",
    timeline: "Completed & Live",
    impact: "24/7 Islandwide Emergency Response & Sub-Second Loading Speeds",
    technologies: [
      "HTML5 (Vanilla)",
      "CSS3 (Flexbox & Grid)",
      "Vanilla JavaScript",
      "PWA Architecture",
      "GPS Location API",
      "WhatsApp Dispatch API",
      "Multilingual Engine"
    ],
    deliverables: [
      "Responsive UI/UX design optimized across desktop, tablet, and mobile",
      "Interactive emergency recovery dispatch modal with GPS auto-detection",
      "Direct WhatsApp booking and instant emergency dispatch pipeline",
      "Multilingual translation system supporting English, Sinhala, and Tamil",
      "Zero-dependency vanilla architecture for peak loading performance",
      "Customer testimonials, interactive services showcase, and emergency CTAs"
    ],
    accentColor: "from-orange-500 to-amber-600",
    mockupType: "browser",
    url: "https://nexorarecovery.netlify.app/",
    features: [
      "Provides a modern digital platform for requesting fast and reliable vehicle towing and roadside assistance services across Sri Lanka with a user-friendly interface.",
      "Implements responsive UI/UX design using modern CSS Flexbox and Grid layouts to ensure smooth accessibility across desktop, tablet, and mobile devices.",
      "Features interactive service sections, animated components, contact forms, customer testimonials, and emergency support call-to-action elements for enhanced engagement.",
      "Developed using pure Vanilla HTML5, CSS3, and JavaScript to achieve lightweight performance, faster loading speeds, easy maintenance, and scalability without external framework dependencies."
    ],
    isFeatured: true,
    order: 2
  },
  {
    slug: "lahiru-udayanga",
    name: "Lahiru Udayanga | Professional Graphic Designer",
    category: "Web",
    tag: "Professional Digital Portfolio",
    badge: "CREATIVE PORTFOLIO",
    subtitle: "Creative Graphic Design Portfolio",
    shortDesc: "High-performance creative digital portfolio showcasing professional branding, flyer designs, and visual identity services.",
    fullDesc: "A sophisticated personal portfolio engineered for a professional graphic designer. Built with pure Vanilla HTML5, CSS3, and JavaScript, the platform features a custom HTML5 Canvas interactive background, frosted glassmorphic cards, infinite image carousels, and responsive 2x2 grid galleries with zero external framework dependencies.",
    client: "Lahiru Udayanga (Professional Graphic Designer)",
    timeline: "Completed & Live",
    impact: "Sub-Second Page Loads, Canvas Parallax & 100% Cross-Device Responsiveness",
    technologies: [
      "HTML5 (Vanilla)",
      "CSS3 (Flexbox & Grid)",
      "Vanilla JavaScript",
      "HTML5 Canvas Engine",
      "Glassmorphism UI",
      "Parallax Algorithms"
    ],
    deliverables: [
      "Custom HTML5 Canvas rendering engine with parallax graffiti reaction",
      "Seamless 2x2 project showcase pages and dynamic education timelines",
      "Frosted glass panel component system (backdrop-filter) and infinite carousels",
      "Typing headline animations and interactive design skill matrix",
      "Pure Vanilla architecture ensuring zero dependency overhead and lasting stability",
      "Fully accessible mobile navigation drawer and interactive contact triggers"
    ],
    accentColor: "from-indigo-600 to-purple-600",
    mockupType: "browser",
    url: "https://lahiruudayanga.netlify.app/",
    features: [
      "Utilizes a custom, performance-optimized HTML5 Canvas rendering engine to draw a live, parallax \"graffiti\" background that dynamically reacts to user scrolling.",
      "Employs modern CSS Flexbox and Grid modules to ensure that complex elements like the seamless 2x2 project pages and dynamic education timelines adapt perfectly across desktop, tablet, and mobile displays.",
      "Features reusable UI components like frosted \"glass panel\" cards (backdrop-filter) and infinite looping image carousels for rendering flyer and banner collections intuitively.",
      "Developed utilizing pure Vanilla HTML5, CSS3, and JavaScript, ensuring rapid page loading times, zero-dependency overhead, and long-term maintainability."
    ],
    isFeatured: true,
    order: 3
  }
];

export const initialServices = [
  {
    slug: "web-development",
    title: "Web Development",
    tagline: "High-performance, modern, and conversion-focused websites.",
    description: "We build custom websites and web applications tailored to your business needs, focusing on speed, responsiveness, and clean code.",
    iconName: "Globe",
    gradient: "from-blue-500 to-indigo-600",
    features: [
      "Custom React, Next.js & Modern Web Apps",
      "Blazing Fast Performance & SEO Optimization",
      "Responsive Layouts (Mobile, Tablet, Desktop)",
      "RESTful & GraphQL API Integrations"
    ],
    subServices: [
      { title: "Landing Pages & Business Sites", desc: "Showcase your brand and capture leads with stunning designs." },
      { title: "Full-Stack Web Applications", desc: "Scalable backends, authentication, databases, and client dashboards." },
      { title: "E-Commerce Solutions", desc: "Modern storefronts, checkout flows, and payment gateway integration." }
    ],
    popular: true,
    order: 1
  },
  {
    slug: "software-development",
    title: "Software Development",
    tagline: "Custom desktop, POS, and automated business software.",
    description: "From desktop POS systems to internal business tools, we craft reliable, robust software engineered to streamline your workflows.",
    iconName: "Cpu",
    gradient: "from-indigo-500 to-purple-600",
    features: [
      "Electron & Cross-Platform Desktop Apps",
      "Offline-First Architecture & Local Databases",
      "Role-Based Access & Staff Management",
      "Automated PDF & CSV Financial Reports"
    ],
    subServices: [
      { title: "POS & Inventory Systems", desc: "Offline-resilient point of sale for restaurants and retail." },
      { title: "Internal Workflow Automation", desc: "Tools to eliminate repetitive tasks and increase productivity." },
      { title: "Custom API & Cloud Integration", desc: "Connect disparate software platforms into cohesive systems." }
    ],
    popular: false,
    order: 2
  },
  {
    slug: "social-media-management",
    title: "Social Media & Growth",
    tagline: "Engage your audience and scale your digital presence.",
    description: "Strategic social media management, content planning, and brand design that convert views into loyal customers.",
    iconName: "Share2",
    gradient: "from-pink-500 to-rose-600",
    features: [
      "Content Strategy & Brand Voice",
      "Visual Identity & Post Graphics",
      "Audience Engagement & Community Growth",
      "Analytics & Performance Tracking"
    ],
    subServices: [
      { title: "Brand Identity Design", desc: "Logos, banners, typography, and cohesive visual guidelines." },
      { title: "Social Campaign Management", desc: "Scheduled posting, copywriting, and targeted campaigns." }
    ],
    popular: false,
    order: 3
  }
];
