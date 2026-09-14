export interface ProcessStep {
  step: string;
  number: string;
  title: string;
  description: string;
  details: string;
  iconName: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    number: "01",
    title: "Discover",
    description: "Understand your business, goals, and requirements.",
    details: "We start with an in-depth consultation to map out your operational challenges, audience expectations, and business objectives.",
    iconName: "Search",
  },
  {
    step: "02",
    number: "02",
    title: "Plan",
    description: "Define the technology, features, timeline, and project scope.",
    details: "We architect the technical specifications, milestone deliverables, technology stack, and clear, realistic execution timelines.",
    iconName: "FileText",
  },
  {
    step: "03",
    number: "03",
    title: "Design",
    description: "Create a modern and intuitive user experience.",
    details: "Our UI/UX specialists craft interactive wireframes, design systems, and responsive prototypes tailored for clarity and engagement.",
    iconName: "Palette",
  },
  {
    step: "04",
    number: "04",
    title: "Develop",
    description: "Build, test, and refine the solution.",
    details: "Our engineers write clean, robust code with continuous integration, strict quality assurance testing, and regular client milestone reviews.",
    iconName: "Code2",
  },
  {
    step: "05",
    number: "05",
    title: "Launch & Support",
    description: "Deploy the project and provide ongoing support.",
    details: "We handle production cloud deployment, security auditing, client training, and long-term maintenance to ensure continuous uptime.",
    iconName: "Rocket",
  },
];

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge: string;
}

export const whyChooseUsData: WhyChooseUsItem[] = [
  {
    id: "modern-tech",
    title: "Modern Technology",
    description: "We utilize proven, cutting-edge frameworks, modern programming standards, and cloud services to ensure long-term stability.",
    iconName: "Layers",
    badge: "Future-Proof",
  },
  {
    id: "custom-solutions",
    title: "Custom Solutions",
    description: "No generic templates or forced shortcuts. Every solution is custom-architected specifically around your unique business requirements.",
    iconName: "Sliders",
    badge: "Tailored to You",
  },
  {
    id: "responsive-design",
    title: "Responsive Design",
    description: "Flawless rendering and intuitive usability across smartphones, tablets, laptops, and ultra-wide desktop monitors.",
    iconName: "Smartphone",
    badge: "Cross-Device",
  },
  {
    id: "scalable-arch",
    title: "Scalable Architecture",
    description: "Built to handle growing traffic, expanding catalogs, and evolving business workflows without needing costly ground-up rewrites.",
    iconName: "TrendingUp",
    badge: "Engineered to Scale",
  },
  {
    id: "transparent-comm",
    title: "Transparent Communication",
    description: "Clear milestone roadmaps, straightforward pricing with zero hidden fees, and consistent weekly progress updates.",
    iconName: "MessageSquare",
    badge: "Clear & Honest",
  },
  {
    id: "reliable-support",
    title: "Reliable Support",
    description: "Dedicated maintenance, proactive system monitoring, security updates, and rapid-response bug fix assistance.",
    iconName: "ShieldCheck",
    badge: "Always Available",
  },
];

export interface AboutPillar {
  title: string;
  description: string;
  iconName: string;
}

export const aboutPillars: AboutPillar[] = [
  {
    title: "Business-focused development",
    description: "We focus on real return on investment and practical business outcomes, not just writing code for the sake of it.",
    iconName: "Target",
  },
  {
    title: "Modern technology",
    description: "Leveraging battle-tested modern tools that ensure speed, maintainability, high security, and lasting longevity.",
    iconName: "Cpu",
  },
  {
    title: "Scalable solutions",
    description: "Architectures designed to grow seamlessly alongside your client base, revenue, and expanding organizational needs.",
    iconName: "TrendingUp",
  },
  {
    title: "Responsive support",
    description: "Direct access to knowledgeable engineers who understand your system and resolve issues quickly.",
    iconName: "Headphones",
  },
  {
    title: "Transparent communication",
    description: "Open channels, regular sprint demonstrations, and honest advisory throughout every stage of our partnership.",
    iconName: "MessagesSquare",
  },
  {
    title: "Quality-focused development",
    description: "Rigorous unit testing, clean architecture principles, and meticulous code reviews before any release.",
    iconName: "CheckCircle2",
  },
];
