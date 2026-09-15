export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  heroHeadline: string;
  heroSubtext: string;
  phone?: string;
  email: string;
  location: string;
  businessHours: string;
  whatsappUrl: string;
  socials: {
    facebook: string;
  };
  stats: {
    id: string;
    value: string;
    label: string;
    sublabel: string;
    highlight: string;
  }[];
}

export const companyData: CompanyInfo = {
  name: "VEXA IT",
  tagline: "Innovate. Build. Grow.",
  description: "Vexa IT builds modern websites, software, social media growth strategies, and digital solutions designed to help businesses grow.",
  heroHeadline: "Technology & Digital Growth That Moves Your Business Forward.",
  heroSubtext: "Vexa IT builds modern websites, custom software, digital growth strategies, and social media solutions designed to scale your business.",
  email: "vexa.it2026@gmail.com",
  phone: "+94 71 269 6668",
  location: "Colombo, Sri Lanka",
  businessHours: "Monday – Friday: 9:00 AM – 6:00 PM (GMT+5:30)",
  whatsappUrl: "https://wa.me/94712696668?text=Hello%20Vexa%20IT,%20I'd%20like%20to%20discuss%20a%20project.",
  socials: {
    facebook: "https://www.facebook.com/share/19L1ATA1vk/?mibextid=wwXIfr",
  },
  stats: [
    {
      id: "projects",
      value: "50+",
      label: "Projects Completed",
      sublabel: "Delivered on schedule & within scope",
      highlight: "across diverse industries",
    },
    {
      id: "clients",
      value: "20+",
      label: "Trusted Clients",
      sublabel: "Startups, SMEs & enterprises",
      highlight: "with 98% retention rate",
    },
    {
      id: "services",
      value: "6+",
      label: "Core Service Verticals",
      sublabel: "Full-cycle digital engineering & growth",
      highlight: "from discovery to scaling",
    },
    {
      id: "support",
      value: "24/7",
      label: "Dedicated Support",
      sublabel: "Proactive monitoring & response",
      highlight: "guaranteed SLA performance",
    },
  ],
};
