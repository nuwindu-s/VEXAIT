export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  iconName: string;
  tags: string[];
  features: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: "web-development",
    title: "Web Development",
    shortDesc: "Modern, responsive websites and web applications built for performance and usability.",
    description: "We architect fast, accessible, and responsive websites and modern single-page applications engineered with clean code, modular design systems, and rock-solid SEO foundations.",
    iconName: "Globe",
    tags: ["React", "TypeScript", "Next.js", "Tailwind CSS", "REST APIs"],
    features: [
      "Custom responsive design for desktop, tablet, and mobile",
      "High performance, sub-second page loads, and core web vitals",
      "Technical SEO architecture and structured schema metadata",
      "Content management integration & intuitive client control",
    ],
  },
  {
    id: "software-development",
    title: "Software Development",
    shortDesc: "Custom software solutions designed around your business requirements.",
    description: "Tailor-made software engineered to solve your exact business bottlenecks, streamline internal workflows, and scale effortlessly as your company expands.",
    iconName: "Code",
    tags: ["Full-Stack", "Node.js", "Python", "Cloud Systems", "Microservices"],
    features: [
      "Custom business applications and internal operational portals",
      "Robust API development and third-party software integrations",
      "Secure role-based access control and data protection",
      "Modular architectures engineered for long-term maintainability",
    ],
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    shortDesc: "Clean, user-focused interfaces that make digital products simple and enjoyable to use.",
    description: "Human-centered digital product design that bridges your business objectives with your users' natural workflows, turning complex tools into delightful experiences.",
    iconName: "Layout",
    tags: ["User Research", "Wireframing", "Figma", "Design Systems", "Prototyping"],
    features: [
      "Interactive high-fidelity wireframes and clickable prototypes",
      "Cohesive design tokens, components, and typography systems",
      "Accessibility compliance (WCAG) and high-contrast usability",
      "Customer journey mapping and conversion-optimized flow design",
    ],
  },
  {
    id: "ecommerce-development",
    title: "E-Commerce Development",
    shortDesc: "Scalable online stores designed to help businesses sell online.",
    description: "Turn casual visitors into loyal repeat customers with fast, high-converting digital storefronts featuring friction-free checkout, secure payments, and inventory sync.",
    iconName: "ShoppingCart",
    tags: ["Custom Stores", "Shopify", "WooCommerce", "Stripe", "Payment Gateways"],
    features: [
      "Ultra-fast product catalog browsing and instant search filtering",
      "Frictionless multi-currency checkout and secure payment gateways",
      "Real-time inventory management and automated order tracking",
      "Customer accounts, wishlists, and promotional discount engines",
    ],
  },
  {
    id: "social-media-management",
    title: "Social Media Management",
    shortDesc: "Strategic social media growth, high-impact content creation, and active audience engagement.",
    description: "Elevate your brand presence across major social channels with data-driven content marketing, engaging visual storytelling, community growth strategies, and ROI-focused ad campaigns.",
    iconName: "Share2",
    tags: ["Content Strategy", "Instagram & Meta", "LinkedIn Growth", "Paid Ad Campaigns", "Brand Building"],
    features: [
      "Strategic content calendar planning & branded creative asset design",
      "Active community management, customer engagement & comment moderation",
      "Targeted paid ad campaign setup, A/B testing & budget optimization",
      "Comprehensive monthly performance analytics and actionable growth reports",
    ],
  },
];
