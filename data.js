/* =====================================================================
 CONTENT SECTION: edit PORTFOLIO_DATA only. The UI below renders from it.
 Projects: add an object to `projects` and it appears automatically.
 Empty fields are hidden (the Project Evidence area always shows). Use images:[{src,caption}], documents:[{label,url}], links:[{label,url}].
 =====================================================================
   Image/document paths must be RELATIVE, e.g. "assets/images/projects/co2-forecast.png" (no leading slash). */
const PORTFOLIO_DATA = {
  personal: {
    name: "Karthik Vinay Putchala",
    headline: "MBA | Human Resources & Operations",
    tagline: "MBA student with hands-on experience in operational data validation, reconciliation, process documentation, analytics, forecasting, and quality-focused projects.",
    location: "Hyderabad, India"
  },
  contact: {
    heading: "Let's Connect",
    text: "Interested in discussing an opportunity, project, or collaboration?",
    email: "karthikvinaykv1105@gmail.com",
    linkedin: "https://linkedin.com/in/karthik-vinay-putchala"
  },
  about: {
    summary: "MBA student focused on Human Resources, Operations, and Business Analytics, with practical experience in transaction validation, reconciliation, process documentation, and operational analysis.",
    focus: ["Operations", "Analytics", "Process Improvement"]
  },
  experience: [{
    company: "Virtusa IT Consulting and IT Services",
    department: "Finance Department",
    role: "Tier 5 Intern \u2013 SEZ Operations & Compliance",
    location: "Hyderabad",
    duration: "June 2026 \u2013 August 2026",
    metrics: [
      { value: "2,000+", label: "DSPF transaction records" },
      { value: "221", label: "vendors" },
      { value: "994", label: "APR records verified" },
      { value: "494", label: "DSPF records reviewed" },
      { value: "450+", label: "SEZ identification cards validated" },
      { value: "100+", label: "SEZ transactions validated" },
      { value: "17", label: "re-export invoices verified" }
    ],
    details: [
      "Reconciled DSPF transaction records against supporting documents and internal trackers.",
      "Reviewed documentation for completeness and filing readiness.",
      "Validated APR records, SEZ identification cards, SEZ transactions, and re-export invoices (against Bills of Entry) using supporting documentation and tracker information.",
      "Identified discrepancies, unmatched records, documentation gaps, and information requirements.",
      "Used trackers and cross-source comparisons to monitor record status and improve traceability.",
      "Surfaced exceptions for follow-up."
    ],
    workflowLabel: "Operational Record Validation Workflow",
    workflow: ["Source Documents", "Validation", "Reconciliation", "Exception Identification", "Tracker Update / Follow-up"]
  }],
  projects: [
    {
      title: "QFD-Based Product Design & Prototyping", category: "Quality Management", status: "Completed",
      description: "Built a physical product prototype using scrap materials as part of a Quality Function Deployment (QFD) activity.",
      overview: "The project involved translating customer requirements into product design considerations and applying the House of Quality framework.",
      metrics: [], tools: [],
      workflow: ["Customer Requirements", "Importance Ratings", "Technical Requirements", "House of Quality", "Product Design", "Physical Prototype"],
      objective: "", approach: "", workPerformed: "", findings: [], images: [], documents: [], links: [],
      placeholders: ["House of Quality", "Prototype Images", "Final Report"]
    },
    {
      title: "Forecasting CO\u2082e Emissions for Sustainable Supply Chain & Operations", category: "AI in Operations & Supply Chain", status: "Completed",
      description: "Forecasted CO\u2082e emissions for 2024\u20132028 using XGBoost regression across multiple U.S. states and industries.",
      overview: "Collected and preprocessed CO\u2082e emissions data across multiple U.S. states and industries. Forecasted emissions for 2024\u20132028 using XGBoost regression, incorporating historical, industry, state, and temporal factors. Developed visualizations of historical and forecast emissions.",
      metrics: [{ value: "2019\u20132023", label: "Historical data" }, { value: "2024\u20132028", label: "Forecast period" }, { value: "XGBoost", label: "Regression model" }],
      tools: ["XGBoost"],
      workflow: ["Data Collection", "Data Preprocessing", "Feature Preparation", "XGBoost Forecasting", "Visualization", "Interpretation"],
      objective: "", approach: "", workPerformed: "",
      findings: ["The Energy industry was identified as the dominant contributor, with the forecast showing a gradual upward emissions trend through 2028."],
      images: [], documents: [], links: [],
      placeholders: ["Dataset", "Forecast Chart", "Visualization", "Project Report"]
    },
    {
      title: "Supplier Concentration Risk in Private-Label Retail", category: "Blockchain Supply Chain & Predictive Analytics", status: "In Progress",
      description: "A study of supplier concentration risk in private-label retail, examining how sourcing concentration can affect exposure to supplier shocks and margin sensitivity.",
      overview: "The project involves developing a dataset and analytical framework using retail companies including Costco, Walmart, and Carrefour.",
      metrics: [], tools: [], workflow: [], objective: "", approach: "", workPerformed: "", findings: [],
      images: [], documents: [], links: [], placeholders: []
    },
    {
      title: "Zara \u2013 Comparative Sales Analysis", category: "Business Analytics", status: "Completed",
      description: "Analyzed revenue and SKU-level information using Power BI and Excel, examining pricing, product positioning, promotions, consumer behavior, and seasonality.",
      overview: "The analysis identified key revenue drivers and translated sales patterns into recommendations relevant to merchandising and store operations.",
      metrics: [{ value: "2.5B+", label: "Revenue analyzed" }, { value: "260K+", label: "SKUs per store" }],
      tools: ["Power BI", "Excel"],
      workflow: ["Data", "Comparative Analysis", "Revenue Drivers", "Visualization", "Business Recommendations"],
      objective: "", approach: "", workPerformed: "", findings: [], images: [], documents: [], links: [],
      placeholders: ["Power BI Dashboard", "Charts", "Analysis Report"]
    },
    {
      title: "Employee Bonus Distribution Analysis", category: "HR Analytics", status: "Completed",
      description: "Analyzed approximately 19K HR records using Python to examine bonus distribution across employee and organizational characteristics.",
      overview: "Developed a Bonus Percentage metric and examined its relationship with experience, training, and company size.",
      metrics: [{ value: "~19K", label: "HR records analyzed" }, { value: "12.5%", label: "Average bonus" }, { value: "8\u201315%", label: "Observed bonus range" }],
      tools: ["Python"], workflow: [], objective: "", approach: "", workPerformed: "", findings: [],
      images: [], documents: [], links: [], placeholders: []
    }
  ],
  skills: {
    primary: {
      "Business & Operations": ["Process Analysis", "Problem Solving", "Quality Management", "Supply Chain Analytics", "Data-Driven Decision Making"],
      "Data & Analytics": ["Data Analysis", "Data Cleaning", "Data Visualization", "Dashboard Development", "Forecasting", "KPI Analysis"],
      "Tools": ["Microsoft Excel", "Power BI", "Python", "PowerPoint"]
    },
    secondary: {
      "Professional": ["Research", "Insight Generation", "Stakeholder Coordination", "Communication", "Presentation"]
    }
  },
  education: [
    { school: "Woxsen University, Hyderabad", degree: "MBA \u2013 Human Resources and Operations", years: "2025 \u2013 2027", grade: "CGPA: 8.13" },
    { school: "GITAM University, Hyderabad", degree: "BBA \u2013 General Management", years: "2022 \u2013 2025", grade: "CGPA: 8.33" }
  ],
  leadership: [{ title: "Class Representative", org: "Woxsen University", years: "2025 \u2013 Present" }],
  certifications: [
    { name: "McKinsey Forward Program", issuer: "", year: "2026" },
    { name: "Human Resources Analytics", issuer: "University of California, Irvine \u2014 Coursera", year: "2025" },
    { name: "Recruiting, Hiring, and Onboarding Employees", issuer: "University of Minnesota \u2014 Coursera", year: "2023" }
  ]
};
