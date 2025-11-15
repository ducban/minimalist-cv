import type { ResumeData } from "@/lib/types";

export const RESUME_DATA: ResumeData = {
  name: "Ban Nguyen",
  initials: "BN",
  location: "Ho Chi Minh City, Viet Nam",
  locationLink: "https://www.google.com/maps/place/Ho+Chi+Minh+City",
  about: "Senior Product Manager with 10+ years of experience delivering 100% revenue growth, 2x GMV expansion, and 1.5-2.2pp conversion improvements across travel, e-commerce, fintech, and entertainment.",
  summary: (
    <>
      Senior Product Manager
    </>
  ),
  avatarUrl: "https://angi.truanay.com/images/photo-2-square.jpg",
  personalWebsiteUrl: "https://ducban.com",
  contact: {
    email: "nguyenducban@me.com",
    tel: "+84983472120",
    social: [
      {
        name: "Website",
        url: "https://ducban.com",
        icon: "globe",
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/bannguyen/",
        icon: "linkedin",
      },
    ],
  },
  education: [
    {
      school: "Swiss International University",
      degree: "Bachelor's Degree in Marketing, School of Marketing and Leadership",
      start: "2016",
      end: "2018",
    },
    {
      school: "Tay Nguyen University",
      degree: "Bachelor's Degree in Agriculture and Forestry",
      start: "1997",
      end: "2001",
    },
  ],
  work: [
    {
      company: "MoMo (M_Service)",
      link: "https://momo.vn/",
      badges: ["AI", "Automation", "Travel", "Fintech"],
      title: "Product Management - Team Leader",
      start: "2024",
      end: null,
      description: (
        <>
          Leading product strategy and development for MoMo Travel, one of Vietnam's top digital travel agencies.
          <ul className="list-inside list-disc">
            <li>
              Launched AI-powered competitive analysis automation using Puppeteer crawlers and n8n workflows,
              delivering real-time market intelligence for strategic decision-making
            </li>
            <li>
              Built multi-agent AI systems with cross-platform capabilities between Claude Code, Factory Droid, and Gemini
            </li>
            <li>
              Developed RAG-based knowledge base system reducing cross-team meeting times by 30%
            </li>
            <li>
              Drove 1.5 percentage point conversion rate increase in train ticket booking through backend refactor and UX redesign
            </li>
            <li>
              Built multi-sided travel marketplace connecting 50+ suppliers including Vietnam Airlines, Vietjet Air, and Vietnam Railways
            </li>
          </ul>
        </>
      ),
    },
    {
      company: "YODY Fashion JSC.",
      link: "https://yody.vn/",
      badges: ["E-commerce", "CDP", "Omni-channel"],
      title: "Head of Product Development",
      start: "2022",
      end: "2023",
      description: (
        <>
          Led strategic transformation from Sapo-based platform to omni-channel e-commerce solution.
          <ul className="list-inside list-disc">
            <li>
              Developed comprehensive omni-channel strategy leveraging Customer Data Platform (CDP) built on BigQuery
            </li>
            <li>
              Designed and implemented store promotion and incentive system with volume-based discounts
            </li>
            <li>
              Recruited, trained, and led cross-functional team of Product Managers, Product Owners, Business Analysts, and Product Designers
            </li>
          </ul>
        </>
      ),
    },
    {
      company: "TIKI",
      link: "https://tiki.vn/",
      badges: ["E-commerce", "C2C Marketplace", "Digital Services"],
      title: "Senior Product Manager",
      start: "2020",
      end: "2022",
      description: (
        <>
          Led product management for DoriDori (Vietnam's first Community Commerce platform) and Digital Service Business expansion.
          <ul className="list-inside list-disc">
            <li>
              Launched Vietnam's first integrated C2C marketplace within main e-commerce app, achieving 40% CVR discovery to PDP
            </li>
            <li>
              Led hands-on development of foundational Order Management System (OMS) and Customer Relationship Management (CRM) systems
            </li>
            <li>
              Scaled digital service use cases including mobile top-up, bill payments - GMV doubled for three consecutive months during COVID
            </li>
          </ul>
        </>
      ),
    },
    {
      company: "VNG Corporation",
      link: "https://vng.com.vn/",
      badges: ["Entertainment", "Fintech", "Marketplace"],
      title: "Senior Product Manager",
      start: "2019",
      end: "2020",
      description: (
        <>
          Dual-role managing TIX.VN (Vietnam's largest movie aggregator) and ZaloPay performance optimization.
          <ul className="list-inside list-disc">
            <li>
              Led TIX.VN as multi-sided marketplace connecting cinema partners including CGV, Galaxy, BHD
            </li>
            <li>
              First movie aggregator to successfully implement CGV integration with Vietnam's dominant cinema chain (45% market share)
            </li>
            <li>
              Delivered 100% revenue increase across aggregator platform and mini-app ecosystem
            </li>
          </ul>
        </>
      ),
    },
    {
      company: "Leo Burnett Vietnam",
      link: "https://www.leoburnett.com/",
      badges: ["AR", "Leads Generation"],
      title: "Digital Producer",
      start: "2016",
      end: "2019",
      description: (
        <>
          Managed digital projects for major clients including FrieslandCampina Vietnam, Samsung Vietnam, Romano.
          <ul className="list-inside list-disc">
            <li>
              Won MMAVN 2017's Best in Show, Most Engaging Mobile Creative, and Mobile Website awards
            </li>
            <li>
              Featured in Facebook Spotlight 2019 with first Spark AR implementation for AFF 2019 Vietnam Football Team
            </li>
          </ul>
        </>
      ),
    },
    {
      company: "Y&R",
      link: "https://www.vml.com/",
      badges: ["Digital Production", "Client Services"],
      title: "Digital Producer",
      start: "2015",
      end: "2016",
      description:
        "Managed digital portfolios for Microsoft Vietnam, Emirates, and Red Bull. Led idea development process coordination using agile methodology.",
    },
    {
      company: "VNG Corporation",
      link: "https://vng.com.vn/",
      badges: ["Traffics Distribusion", "Gaming"],
      title: "Product Manager",
      start: "2014",
      end: "2015",
      description: (
        <>
          Led product management for Vuigame.vn, Vietnam's leading mini-game portal.
          <ul className="list-inside list-disc">
            <li>
              Released comprehensive new version achieving 150% DAU increase, tripled time-on-site
            </li>
            <li>
              Promoted mini-game portal as top internal traffic source for 360game.vn
            </li>
          </ul>
        </>
      ),
    },
    {
      company: "TheGioiDiDong",
      badges: ["Freelancing", "Web Development", "E-commerce", "SEO"],
      title: "Full-stack Web Developer",
      start: "2012",
      end: "2014",
      description:
        "Full-stack web development specializing in e-commerce platforms. Delivered 3-month front-end development project for TheGioiDiDong v3.0.",
    },
    {
      company: "TX INC.",
      badges: ["Social Network", "Team Leadership"],
      title: "Product Manager",
      start: "2011",
      end: "2012",
      description: (
        <>
          Led product management for Truongxua.com, Vietnam's pioneering school-focused social network.
          <ul className="list-inside list-disc">
            <li>
              Managed cross-functional team of 15+ members including Product Managers, UI/UX designers
            </li>
            <li>
              Delivered 150% increase in time-on-site and 200% increase in new user acquisition
            </li>
          </ul>
        </>
      ),
    },
  ],
  skills: [
    "Product Management & Strategy",
    "Cross-functional Team Leadership",
    "Data Analysis & Performance Optimization",
    "Agile & Scrum Methodologies",
    "AI Development (Python, TypeScript)",
    "LangChain & AI Agents",
    "Prompt Engineering",
    "N8N Automation",
    "Customer Data Platform (CDP)",
    "Google Analytics & Amplitude",
    "BigQuery & Supabase",
    "P&L Management",
    "Growth Hacking & User Acquisition",
    "A/B Testing & Conversion Optimization",
    "API Integration & System Architecture",
  ],
  projects: [
    {
      title: "AI-Powered Competitive Analysis System",
      techStack: ["Python", "TypeScript", "Puppeteer", "N8N", "BigQuery"],
      description:
        "Built comprehensive monitoring system using Puppeteer crawlers to track competitor websites and campaigns, providing real-time market intelligence and strategic insights for travel industry operations.",
      link: {
        label: "Internal Project",
        href: "https://momo.vn/",
      },
    },
    {
      title: "Góp Lá Vá Rừng - Sustainability Initiative",
      techStack: ["Rule-based Triggers", "Campaign Management", "Partnership Integration"],
      description:
        "Led co-branding campaign with Vietnam Airlines winning Human Act Prize 2024. Generated 35,000 trees planted across 50 hectares through automated customer engagement and rule-based trigger missions embedded in each ticket sold.",
      link: {
        label: "Award-Winning Project",
        href: "https://momo.vn/",
      },
    },
    {
      title: "Vietnam's First C2C Marketplace - DoriDori",
      techStack: ["OMS", "CRM", "Multi-carrier Logistics", "Amplitude", "CDP"],
      description:
        "Launched Vietnam's first integrated C2C marketplace within main e-commerce app, achieving 40% CVR discovery to PDP, 5% CVR to orders, and 20% daily active user retention. Built foundational OMS and CRM systems from scratch.",
      link: {
        label: "Market Innovation",
        href: "https://tiki.vn/",
      },
    },
    {
      title: "TIX.VN - CGV Integration",
      techStack: ["API Integration", "Revenue Sharing Models", "Inventory Synchronization"],
      description:
        "First movie aggregator to successfully implement CGV integration with Vietnam's dominant cinema chain (45% market share) in the $160M cinema market. Delivered 100% revenue increase across aggregator platform and mini-app ecosystem.",
      link: {
        label: "Strategic Partnership",
        href: "https://vng.com.vn/",
      },
    },
    {
      title: "Digital Services Business Expansion",
      techStack: ["Full-stack Development", "Scrum Framework", "Automated Testing"],
      description:
        "Successfully onboarded and scaled digital service use cases including mobile top-up, bill payments. Became main cash flow during COVID lockdown with GMV doubling for three consecutive months after electricity & water bill rollout.",
      link: {
        label: "Business Diversification",
        href: "https://tiki.vn/",
      },
    },
    {
      title: "RAG-Based Knowledge Base System",
      techStack: ["Python", "LangChain", "OpenAI", "Supabase", "TypeScript"],
      description:
        "Developed RAG-based Chat agent system that significantly improved cross-team collaboration by providing instant access to institutional knowledge and reducing information silos. Reduced cross-team meeting times by 30%.",
      link: {
        label: "Internal Project",
        href: "https://momo.vn/",
      },
    },
  ],
} as const;