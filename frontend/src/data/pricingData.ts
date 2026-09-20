export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  isStartingFrom?: boolean;
  billingPeriod?: string; // e.g. "/ month"
  popular?: boolean;
  suitableFor: string;
  features: string[];
}

export interface ServicePricing {
  id: string;
  serviceTitle: string;
  serviceSubtitle: string;
  iconName: string;
  startingPrice: string;
  importantNote?: string;
  packages: PricingPackage[];
}

export const pricingData: ServicePricing[] = [
  {
    id: "web-development",
    serviceTitle: "Web Development",
    serviceSubtitle: "Build a modern digital presence with fast, responsive websites.",
    iconName: "Globe",
    startingPrice: "Rs. 35,000",
    packages: [
      {
        id: "web-starter",
        name: "Starter",
        price: "Rs. 35,000",
        suitableFor: "Startups, individuals, and simple business landing pages or portfolio websites.",
        features: [
          "1–3 pages",
          "Responsive design",
          "Mobile-friendly layout",
          "WhatsApp integration",
          "Contact form",
          "Basic SEO setup",
          "Basic deployment",
        ],
      },
      {
        id: "web-business",
        name: "Business",
        price: "Rs. 65,000",
        popular: true,
        suitableFor: "Growing businesses requiring a complete, custom branded company website.",
        features: [
          "5–7 pages",
          "Custom UI design",
          "Responsive development",
          "Contact & inquiry forms",
          "Basic SEO",
          "Google Analytics integration",
          "Social media integration",
          "Deployment & setup",
        ],
      },
      {
        id: "web-professional",
        name: "Professional",
        price: "Rs. 110,000+",
        isStartingFrom: true,
        suitableFor: "Established businesses needing dynamic content, CMS control, animations, and custom integrations.",
        features: [
          "8–12+ pages",
          "Advanced custom UI",
          "Advanced animations/interactions",
          "CMS integration where required",
          "Advanced SEO setup",
          "Analytics",
          "Third-party integrations",
          "Deployment",
          "Post-launch support",
        ],
      },
    ],
  },
  {
    id: "software-development",
    serviceTitle: "Software Development",
    serviceSubtitle: "Custom software systems engineered to streamline operations and scale your business.",
    iconName: "Code",
    startingPrice: "Rs. 45,000+",
    importantNote: "Final price depends on project requirements.",
    packages: [
      {
        id: "software-basic",
        name: "Basic",
        price: "Rs. 45,000+",
        isStartingFrom: true,
        suitableFor: "Small business processes, internal utilities, and single-workflow automations.",
        features: [
          "Small custom software system",
          "Database integration",
          "Basic authentication",
          "Core business functionality",
          "Responsive interface",
          "Basic testing",
        ],
      },
      {
        id: "software-business",
        name: "Business",
        price: "Rs. 90,000+",
        isStartingFrom: true,
        popular: true,
        suitableFor: "Medium businesses needing multi-user role management, admin dashboards, and custom reporting.",
        features: [
          "Custom business application",
          "Database",
          "User authentication",
          "Admin dashboard",
          "Reports",
          "Role-based access",
          "API integration",
          "Deployment",
        ],
      },
      {
        id: "software-advanced",
        name: "Advanced",
        price: "Rs. 180,000+",
        isStartingFrom: true,
        suitableFor: "Enterprises needing full-scale systems, automated pipelines, complex architectures, and ongoing SLAs.",
        features: [
          "Full-scale business application",
          "Advanced admin panel",
          "Multiple user roles",
          "Advanced database architecture",
          "API integrations",
          "Automated workflows",
          "Reports & analytics",
          "Deployment",
          "Ongoing support options",
        ],
      },
    ],
  },
  {
    id: "ui-ux-design",
    serviceTitle: "UI/UX Design",
    serviceSubtitle: "Human-centered digital product designs crafted for engagement, aesthetics, and usability.",
    iconName: "Layout",
    startingPrice: "Rs. 15,000",
    packages: [
      {
        id: "uiux-starter",
        name: "Starter",
        price: "Rs. 15,000",
        suitableFor: "Landing pages, quick concepts, and simple prototype mockups.",
        features: [
          "3–5 screens",
          "Wireframes",
          "Basic UI design",
          "Mobile considerations",
        ],
      },
      {
        id: "uiux-business",
        name: "Business",
        price: "Rs. 30,000",
        popular: true,
        suitableFor: "Mobile apps and business websites needing polished UI, interactive flows, and UX prototypes.",
        features: [
          "6–10 screens",
          "Complete UI design",
          "User flows",
          "Interactive prototype",
          "Responsive design guidance",
        ],
      },
      {
        id: "uiux-complete",
        name: "Complete",
        price: "Rs. 55,000+",
        isStartingFrom: true,
        suitableFor: "Full product design systems, enterprise software, and complete developer-ready component libraries.",
        features: [
          "Full UI/UX design",
          "User flows",
          "Wireframes",
          "High-fidelity designs",
          "Interactive prototype",
          "Design system",
          "Components",
          "Developer handoff",
        ],
      },
    ],
  },
  {
    id: "ecommerce-development",
    serviceTitle: "E-Commerce Development",
    serviceSubtitle: "High-converting online stores built for seamless shopping, inventory sync, and secure payments.",
    iconName: "ShoppingCart",
    startingPrice: "Rs. 60,000",
    packages: [
      {
        id: "ecom-starter",
        name: "Starter Store",
        price: "Rs. 60,000",
        suitableFor: "Boutiques and small merchants starting their first online retail storefront.",
        features: [
          "Online store",
          "Product listings",
          "Categories",
          "Product details",
          "Responsive design",
          "WhatsApp integration",
          "Basic order management",
        ],
      },
      {
        id: "ecom-business",
        name: "Business Store",
        price: "Rs. 100,000",
        popular: true,
        suitableFor: "Retail brands seeking online payment gateways, automated carts, inventory management, and customer accounts.",
        features: [
          "Full ecommerce website",
          "Product management",
          "Shopping cart",
          "Checkout",
          "Payment gateway integration",
          "Inventory management",
          "Order management",
          "Customer management",
        ],
      },
      {
        id: "ecom-advanced",
        name: "Advanced Store",
        price: "Rs. 175,000+",
        isStartingFrom: true,
        suitableFor: "High-volume retailers requiring courier/delivery APIs, automated discount rules, and advanced analytics.",
        features: [
          "Advanced ecommerce platform",
          "Advanced inventory",
          "Payment integrations",
          "Delivery integration",
          "Coupons & discounts",
          "Customer accounts",
          "Analytics",
          "Advanced order management",
          "Third-party integrations",
        ],
      },
    ],
  },
  {
    id: "social-media-management",
    serviceTitle: "Social Media Management",
    serviceSubtitle: "Monthly social media growth, visual storytelling, and active audience engagement.",
    iconName: "Share2",
    startingPrice: "Rs. 20,000 / month",
    importantNote: "Advertising budget is not included in the management fee.",
    packages: [
      {
        id: "smm-starter",
        name: "Starter",
        price: "Rs. 20,000",
        billingPeriod: "/ month",
        suitableFor: "Small businesses maintaining consistent monthly brand visibility across Facebook & Instagram.",
        features: [
          "8 social media posts",
          "4 stories",
          "Caption writing",
          "Basic content planning",
          "Facebook & Instagram management",
        ],
      },
      {
        id: "smm-growth",
        name: "Growth",
        price: "Rs. 35,000",
        billingPeriod: "/ month",
        popular: true,
        suitableFor: "Growing brands looking to accelerate reach with short-form reels and active community engagement.",
        features: [
          "12 social media posts",
          "4 reels",
          "Stories",
          "Caption writing",
          "Content strategy",
          "Audience engagement",
          "Facebook & Instagram management",
        ],
      },
      {
        id: "smm-business",
        name: "Business",
        price: "Rs. 55,000",
        billingPeriod: "/ month",
        suitableFor: "Established brands seeking comprehensive monthly social media presence with video reels and monthly performance reports.",
        features: [
          "16 social media posts",
          "8 reels",
          "Stories",
          "Content strategy",
          "Audience engagement",
          "Facebook & Instagram management",
          "Monthly performance report",
        ],
      },
    ],
  },
];
