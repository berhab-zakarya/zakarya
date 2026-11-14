/* All copy and placeholder data live here. Replace placeholders with real, verified content. */
/* Budget buckets shared by the contact form and the pricing estimator (so an estimate can pre-select the right one). */
const budgetTiers = [
  [150000, "Under 150,000 DZD"],
  [300000, "150,000 – 300,000 DZD"],
  [600000, "300,000 – 600,000 DZD"],
  [Infinity, "600,000+ DZD"],
];

export const site = {
  brand: "Zakarya",
  contactHref: "#contact", // swap for a real route or mailto:
  nav: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    eyebrow: "INDEPENDENT FULL-STACK DEVELOPER",
    tag: "FIXED PRICES",
    // strings render plain, { b } renders in the accent colour
    lines: [["I build the"], ["first version of"], [{ b: "your product." }]],
    lead: "Web apps, mobile apps and business systems for startups. I do the design, backend, frontend and deployment myself.",
    cta: "Get a quote",
    cardCta: "Describe your project",
    priceLink: { label: "MVPs from 180,000 DZD", note: "See live pricing · students get 20% off", href: "#pricing" },
    proofTitle: "AT A GLANCE",
    proof: [
      ["24", "Projects built or in progress"],
      ["1 person", "Design to deployment, no handoffs"],
      ["Fixed price", "Quoted after a free call"],
    ],
    logosTitle: "Selected projects",
    logosCopy: "Systems and products I've built for myself and for clients.",
    logos: [["Mekial", "w1"], ["Medtasty", "w2"], ["DataMaster", "w3"], ["StudX", "w4"]],
  },

  /* ---- Selected work (#work) ---- */
  work: {
    lead: "Projects I built, from live products and client systems to practice builds and prototypes. Screenshots appear where the project has them.",
    items: [
      {
        name: "Mekial",
        kind: "ERP and POS · My company",
        logo: "/logos/mekial.png",
        href: "https://mekial.app",
        text: "Multi-branch ERP and point of sale for Algerian shops. Stock, purchases, invoicing, payroll and reports live in one system, sold as a subscription and running live at mekial.app.",
        techs: [["django", "Django"], ["nextjs", "Next.js"], ["flutter", "Flutter"], ["postgresql", "PostgreSQL"], ["redis", "Redis"], ["tauri", "Tauri"], ["docker", "Docker"]],
      },
      {
        name: "Medtasty",
        kind: "University e-learning platform",
        logo: "/logos/medtasty.png",
        href: "https://medtasty.com",
        text: "Learning platform for a dentistry university. Students work through chapters, lecture video, live sessions and quizzes, while staff manage courses and payments from a Next.js dashboard. Django and MySQL behind it, Flutter app on top.",
        techs: [["django", "Django"], ["nextjs", "Next.js"], ["flutter", "Flutter"], ["mysql", "MySQL"], ["firebase", "Firebase"], ["redis", "Redis"]],
      },
      {
        name: "Algecom",
        kind: "E-commerce platform · Licence project",
        text: "Shopify-style store builder for Algerian merchants. Each seller gets an admin for products, orders, invoices, customers and DZD subscriptions, with a setup guide that runs from store name and custom domain to first product, shipping rates and a payment provider.",
        images: [
          { src: "/projects/algecom/01-setup.webp", width: 1600, height: 1600, alt: "Store setup guide with steps for shop name, domain, first product and payments" },
          { src: "/projects/algecom/02-subscribe.webp", width: 1600, height: 1600, alt: "Subscription screen with a 1999 DZD monthly plan and card payment details" },
          { src: "/projects/algecom/03-dashboard.webp", width: 1600, height: 1600, alt: "Seller dashboard with income, expenses, spending chart and order list" },
          { src: "/projects/algecom/04-settings.webp", width: 1600, height: 1600, alt: "Account settings with addresses and saved payment methods" },
          { src: "/projects/algecom/05-cover.webp", width: 1600, height: 1600, alt: "Algecom cover slide for the licence project presentation" },
        ],
      },
      {
        name: "Datamaster HR",
        kind: "HR platform · Built for Datamaster",
        logo: "/logos/datamaster.svg",
        text: "HR and project management for Datamaster. Employees, contracts, leave, attendance, payroll, projects and timesheets share a Django API, a React admin app and a Flutter mobile app.",
        techs: [["django", "Django"], ["react", "React"], ["flutter", "Flutter"], ["postgresql", "PostgreSQL"], ["redis", "Redis"], ["antd", "Ant Design"]],
      },
      {
        name: "Document management",
        kind: "Document system · Built for Datamaster",
        text: "Document management for Datamaster: folders, sharing, signature requests, an audit log and notifications. Django and PostgreSQL API with a React front end.",
        techs: [["django", "Django"], ["react", "React"], ["postgresql", "PostgreSQL"], ["typescript", "TypeScript"], ["vitejs", "Vite"]],
      },
      {
        name: "Retail ERP",
        kind: "Retail ERP · Built for Datamaster",
        logo: "/logos/datamaster-retail.png",
        text: "Retail ERP in use in stores. Point of sale, stock counts, purchasing and sales reports share one Django API, with three Flutter clients for sales agents, store staff and inventory counts.",
        techs: [["django", "Django"], ["flutter", "Flutter"], ["mysql", "MySQL"], ["redis", "Redis"], ["python", "Python"]],
      },
      {
        name: "Journal platform",
        kind: "Editorial platform · Scientific journal",
        text: "Peer-review platform for a scientific journal. Authors submit, editors assign reviewers, decisions run in two stages, and the published catalogue is public. Laravel API, React front end, role-based permissions.",
        techs: [["laravel", "Laravel"], ["react", "React"], ["mysql", "MySQL"], ["tailwindcss", "Tailwind CSS"], ["typescript", "TypeScript"], ["vitejs", "Vite"]],
      },
      {
        name: "StudX PTM",
        kind: "Agency site and console",
        logo: "/logos/studx.svg",
        href: "https://studxptm.com",
        text: "Public site for StudX PTM plus the internal console: missions, project revenue, payments, staff accounts and email. Next.js front end talking to a Django REST API.",
        techs: [["nextjs", "Next.js"], ["typescript", "TypeScript"], ["tailwindcss", "Tailwind CSS"], ["django", "Django"], ["postgresql", "PostgreSQL"], ["nodejs", "Node.js"]],
      },
      {
        name: "StudX Store",
        kind: "Template storefront · StudX",
        logo: "/logos/studx-store.svg",
        text: "Storefront for StudX website templates and mobile products. Catalogue filters, product pages, cart and wishlist, built with Next.js and Redux Toolkit.",
        techs: [["nextjs", "Next.js"], ["typescript", "TypeScript"], ["redux", "Redux Toolkit"], ["tailwindcss", "Tailwind CSS"]],
      },
      {
        name: "Ibn Khamis Services",
        kind: "Services app · Built for Ibn Khamis",
        text: "Services app for an Algerian office. Customers apply for tests, download files, follow news and book appointments; admins manage applications, files and users. Flutter with Firebase auth, Firestore and push notifications.",
        techs: [["flutter", "Flutter"], ["dart", "Dart"], ["firebase", "Firebase"]],
      },
      {
        name: "Otor ERP",
        kind: "HR dashboard · In progress",
        logo: "/logos/otor.svg",
        text: "HR and operations dashboard in progress. Staff records, charts and a module map for payroll, memos, inventory and procurement, built as a Next.js front end.",
        techs: [["nextjs", "Next.js"], ["react", "React"], ["typescript", "TypeScript"], ["tailwindcss", "Tailwind CSS"]],
      },
      {
        name: "StudX Club",
        kind: "Club platform · StudX",
        text: "Backend for a university student club. Membership signup creates the member profile and avatar, points track activity, and document requests render to letters and email. Django REST API with JWT auth and PostgreSQL.",
        techs: [["django", "Django"], ["python", "Python"], ["postgresql", "PostgreSQL"], ["swagger", "Swagger"]],
      },
      {
        name: "Kidoso",
        kind: "Mobile learning app",
        logo: "/logos/kidoso.png",
        text: "Arabic learning app for children aged 7 to 12. Graded reading and writing exercises, assessments, an admin dashboard and an AI tutor built on Gemini. Flutter app backed by Firebase.",
        techs: [["flutter", "Flutter"], ["dart", "Dart"], ["firebase", "Firebase"], ["gemini", "Gemini"]],
        images: [
          { src: "/projects/kidoso/01-onboarding-welcome.webp", width: 412, height: 890, alt: "Onboarding slide welcoming children to the learning app" },
          { src: "/projects/kidoso/02-onboarding-activities.webp", width: 417, height: 864, alt: "Onboarding slide about choosing an activity and following progress" },
          { src: "/projects/kidoso/03-onboarding-ai.webp", width: 413, height: 873, alt: "Onboarding slide about AI-assisted learning" },
          { src: "/projects/kidoso/04-auth.webp", width: 409, height: 873, alt: "Sign-in and sign-up screen with the Kidoso mascot" },
          { src: "/projects/kidoso/05-signup.webp", width: 413, height: 867, alt: "New account form with name, email and password fields" },
          { src: "/projects/kidoso/10-quiz.webp", width: 414, height: 866, alt: "Quiz question with four answer choices and a sign-language illustration" },
        ],
      },
      {
        name: "Like4Follow",
        kind: "Android prototype · Early",
        text: "Native Android app named Like4Follows. Only the launcher screen exists so far; there is no networking, storage or feature logic yet.",
        techs: [["android", "Android"], ["java", "Java"]],
      },
      {
        name: "Django blog",
        kind: "Practice project · Django",
        text: "Small blog built to practise Django. One Post model with a list and a detail page, served through Django templates and managed from the admin.",
        techs: [["django", "Django"], ["python", "Python"], ["sqlite", "SQLite"]],
      },
      {
        name: "Django chat",
        kind: "Practice project · Django",
        text: "Room-based chat prototype: enter a room name and username, then land in a room page. Room and Message models exist, but there are no WebSockets or stored message history yet.",
        techs: [["django", "Django"], ["python", "Python"], ["sqlite", "SQLite"]],
      },
      {
        name: "E-commerce store",
        kind: "E-commerce · Early build",
        text: "Storefront and admin split across a Laravel API and a React app. So far it has registration, login, Google OAuth and a user list; products and orders are not built.",
        techs: [["laravel", "Laravel"], ["react", "React"], ["mysql", "MySQL"], ["redux", "Redux"]],
      },
      {
        name: "Management portfolio",
        kind: "Personal portfolio · Next.js",
        text: "Single-page portfolio with a bento project grid, an about block and motion effects. Static data, no CMS or backend, built on an early Next.js scaffold.",
        techs: [["nextjs", "Next.js"], ["react", "React"], ["typescript", "TypeScript"], ["tailwindcss", "Tailwind CSS"]],
      },
      {
        name: "Portfolio CMS",
        kind: "Personal site · Next.js and Django API",
        text: "Portfolio site with an admin dashboard for editing the hero, projects, testimonials, companies and work history. Next.js front end, Django API and JWT auth.",
        techs: [["nextjs", "Next.js"], ["typescript", "TypeScript"], ["react", "React"], ["django", "Django"], ["redux", "Redux"]],
      },
      {
        name: "Portfolio API",
        kind: "Practice project · Django REST",
        text: "REST API for a portfolio with account registration, token login, blog posts with tags and an image gallery. The projects app is still empty and the URL prefixes are broken.",
        techs: [["django", "Django"], ["python", "Python"], ["sqlite", "SQLite"]],
      },
      {
        name: "OCEAN landing",
        kind: "Static landing page · Next.js",
        text: "Marketing page for OCEAN, a CRM dashboard concept. Hero, client logos, feature blocks, pricing and testimonials, all from static data. No backend or working navigation.",
        techs: [["nextjs", "Next.js"], ["react", "React"], ["typescript", "TypeScript"], ["tailwindcss", "Tailwind CSS"]],
      },
      {
        name: "Elshawi Legal",
        kind: "Legal platform · Early scaffold",
        text: "Legal practice and library platform planned around Django, Next.js and a Weaviate vector store. The app folders are empty, so only the project structure and admin are in place.",
        techs: [["django", "Django"], ["nextjs", "Next.js"], ["typescript", "TypeScript"], ["docker", "Docker"]],
      },
      {
        name: "Usiha admin",
        kind: "Admin backend · Early build",
        text: "Django admin service for authentication and orchestration: JWT login, OTP password reset, audit middleware and internal HTTP clients. Only the auth app exists; the other declared apps are not implemented.",
        techs: [["django", "Django"], ["postgresql", "PostgreSQL"], ["redis", "Redis"], ["rabbitmq", "RabbitMQ"]],
      },
      {
        name: "Developer portfolio",
        kind: "Portfolio template · Next.js",
        text: "Open-source developer portfolio template by Abu Said, repersonalised with my data. Sections for experience, projects, skills and a contact form with reCAPTCHA.",
        techs: [["nextjs", "Next.js"], ["tailwindcss", "Tailwind CSS"], ["sass", "Sass"], ["js", "JavaScript"]],
      },
    ],
  },

  /* ---- Services + stack (#services) ---- */
  services: {
    lead: "Startup MVPs, SaaS products and marketplaces. Other business software too, if that's what you need.",
    items: [
      { title: "SaaS MVPs", text: "Accounts, a dashboard and your one core workflow, so you can put it in front of users." },
      { title: "Marketplaces", text: "Buyers, sellers, listings, orders and an admin panel, from a single-vendor shop to a full multi-vendor platform." },
      { title: "Something else", text: "Business systems, mobile apps, internal tools. We pick the stack after we talk." },
    ],
    stackTitle: "What I build with",
    stack: [
      { group: "Backend", tools: ["Node.js (Express)", "Django"] },
      { group: "Frontend", tools: ["React", "Next.js"] },
      { group: "Mobile", tools: ["Flutter", "React Native", "Android (Kotlin)"] },
    ],
  },

  /* ---- Live pricing (#pricing). ALL numbers are DZD and live here: edit them to match your real rates. ---- */
  pricing: {
    eyebrow: "LIVE PRICING · DZD",
    title: "What it costs.",
    lead: "Pick what you're building and how complete it should be. The price updates as you choose.",
    studentRate: 0.2, // 20% off for students
    studentLabel: "I'm a student",
    studentNote: "Student card required.",
    rangeSpread: [0.9, 1.1], // the "typical range" shown next to the estimate
    budgetTiers,
    disclaimer: "Indicative fixed-scope estimate. Agencies in Algiers quote 1.5M–5M DZD for a web MVP (Kolonell, Sept 2026); I work alone, so the same core scope costs a fraction of that. The final quote is confirmed after a short free call.",
    ctaLabel: "Send this estimate",
    // base = MVP price in DZD (core workflow only), weeks = typical build time, formType must match a contact.form.projectTypes entry
    types: [
      { id: "saas", name: "SaaS MVP", desc: "Validate a startup idea", base: 180000, weeks: 5, formType: "SaaS / startup",
        includes: ["Auth & accounts", "Responsive web app", "One core workflow", "Deployment"] },
      { id: "marketplace", name: "Marketplace", desc: "Buyers, sellers & orders", base: 280000, weeks: 6, formType: "Marketplace",
        includes: ["Buyer & seller accounts", "Listings, search & orders", "Basic admin panel", "Deployment"] },
      { id: "business", name: "Business system", desc: "ERP, HR, documents…", base: 300000, weeks: 8, formType: "Business system",
        includes: ["Roles & permissions", "Core modules & tables", "Basic reports", "Deployment"] },
      { id: "mobile", name: "Mobile app", desc: "Flutter, React Native or Kotlin", base: 200000, weeks: 5, formType: "Mobile app",
        includes: ["Android (iOS with Flutter / RN)", "API & backend", "Store-ready build"] },
    ],
    // Plans are presets of add-ons. `addons: null` = the visitor picks them. Ids that don't fit the type are skipped.
    plans: [
      { id: "mvp", name: "MVP", desc: "One core workflow, nothing extra.", addons: [] },
      { id: "launch", name: "Launch-ready", desc: "MVP plus UI/UX design, online payments and an admin dashboard.", addons: ["design", "payments", "dashboard"] },
      { id: "custom", name: "Custom", desc: "Add or remove extras yourself.", addons: null },
    ],
    // `only`: show this add-on just for these types (omitted = all types)
    addons: [
      { id: "design", name: "UI/UX design in Figma", desc: "Wireframes and a clickable prototype", price: 45000, weeks: 1 },
      { id: "mobile", name: "Mobile app", desc: "Flutter, React Native or Kotlin", price: 140000, weeks: 3, only: ["saas", "marketplace", "business"] },
      { id: "web", name: "Web admin panel", desc: "Manage everything from the browser", price: 80000, weeks: 2, only: ["mobile"] },
      { id: "vendors", name: "Multi-vendor stores", desc: "Sellers run their own storefronts", price: 110000, weeks: 2, only: ["marketplace"] },
      { id: "payments", name: "Online payments", desc: "Edahabia / CIB or Stripe", price: 40000, weeks: 1 },
      { id: "dashboard", name: "Admin dashboard", desc: "KPIs, charts, exports", price: 50000, weeks: 1, only: ["saas", "marketplace", "mobile"] },
      { id: "i18n", name: "Arabic · French · English", desc: "Multi-language with RTL", price: 30000, weeks: 1 },
      { id: "notify", name: "Notifications", desc: "Email, SMS and push", price: 25000, weeks: 1 },
      { id: "ai", name: "AI features", desc: "Assistants, search, automation", price: 60000, weeks: 2 },
    ],
    elseLabel: "Something else?",
    elseCta: "Describe it and I'll quote it",
  },

  /* ---- Contact / project inquiry section (#contact) ---- */
  contact: {
    // Where inquiries are POSTed as JSON. Leave "" until a real endpoint exists: the form then runs in
    // local mode and tells the visitor honestly that nothing was sent.
    endpoint: "",
    bookingUrl: "",   // e.g. "https://cal.com/you/intro". Empty = the "Book a call" link is not rendered
    privacyHref: "",  // e.g. "/privacy". Empty = the privacy note renders without a link
    eyebrow: "INDEPENDENT FULL-STACK DEVELOPER",
    tag: "FIXED PRICES",
    // strings render plain, { b } renders in the accent tint
    title: [["Tell me what"], [{ b: "you want built." }]],
    lead: "Two short steps. I reply with a scope and a fixed price.",
    bookingLead: "Prefer a quick conversation?",
    bookingLabel: "Book a call",
    logosTitle: "Selected projects",
    logos: [["Mekial", "w1"], ["Medtasty", "w2"], ["DataMaster", "w3"]],
    testimonial: null, // { quote, author, role }: renders only when you add a real one
    form: {
      title: "Tell me about your project.",
      steps: [
        { label: "Project", heading: "What are you building?" },
        { label: "Contact", heading: "How can I reach you?" },
      ],
      privacyNote: "I only use these details to reply about your project.",
      projectTypes: ["SaaS / startup", "Marketplace", "Mobile app", "Business system", "Other"],
      budgets: ["Not sure yet", ...budgetTiers.map((t) => t[1])],
      done: {
        title: "Thanks, I got it.",
        body: "I'll read the details and reply using the contact information you provided.",
        localTitle: "Form complete. Nothing was sent.",
        localBody: "This site isn't connected to an inbox yet, so your answers stayed in this browser tab. Set contact.endpoint in src/content/site.js to deliver inquiries.",
      },
    },
  },

  about: {
    title: "About",
    text: [
      "I'm Zakarya, an independent full-stack developer. I work alone, so you talk to the person who writes the code.",
      "I run Mekial, my own ERP sold as a SaaS, and I've built a university e-learning platform, retail and HR systems for Datamaster, and an editorial platform for a scientific journal. I'd rather scope a small MVP properly than sell you a big build you don't need yet.",
    ],
    stepsTitle: "How it works",
    steps: [
      ["Free call", "We agree on the scope and what the MVP should include."],
      ["Fixed quote", "You get one price in DZD, confirmed before I start."],
      ["Build & deploy", "I build it, deploy it and hand it over."],
    ],
  },
};
