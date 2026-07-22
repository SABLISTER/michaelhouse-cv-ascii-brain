export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavigationLink {
  label: string
  href: string
}

export interface NavigationConfig {
  brandName: string
  links: NavigationLink[]
}

export interface HeroConfig {
  eyebrow: string
  titleLines: string[]
  leadText: string
  supportingNotes: string[]
}

export interface ManifestoConfig {
  videoPath: string
  text: string
}

export interface FacilityArticle {
  title: string
  paragraphs: string[]
}

export interface FacilityItem {
  slug: string
  name: string
  code: string
  address: string
  status: string
  email: string
  phone: string
  ctaText: string
  ctaHref: string
  image: string
  utcOffset: number
  article: FacilityArticle
}

export interface FacilitiesConfig {
  sectionLabel: string
  detailBackText: string
  detailNotFoundText: string
  detailReturnText: string
  items: FacilityItem[]
}

export interface ObservationConfig {
  sectionLabel: string
  videoPath: string
  statusText: string
  latLabel: string
  lonLabel: string
  initialLat: number
  initialLon: number
}

export interface ArchiveItem {
  src: string
  label: string
}

export interface ArchivesConfig {
  sectionLabel: string
  vaultTitle: string
  closeText: string
  items: ArchiveItem[]
}

export interface FooterConfig {
  copyrightText: string
  statusText: string
}

export const siteConfig: SiteConfig = {
  language: "en",
  siteTitle: "Michael House — Neurobehavioral Analyst & Researcher",
  siteDescription:
    "Michael House is a neurobehavioral analyst at the Child Mind Institute, working across EEG, fMRI, and computational methods to turn complex neural data into accessible, real-world tools for neurodivergent communities.",
}

export const navigationConfig: NavigationConfig = {
  brandName: "HOUSE",
  links: [
    { label: "About", href: "#manifesto" },
    { label: "Experience", href: "#facilities" },
    { label: "Research", href: "#archives" },
  ],
}

export const heroConfig: HeroConfig = {
  eyebrow: "Neurobehavioral Analyst — Child Mind Institute",
  titleLines: ["Michael", "House"],
  leadText:
    "Neuroscience researcher working across EEG, fMRI, and computational methods — translating complex neural data into accessible, real-world tools for neurodivergent communities.",
  supportingNotes: [
    "B.A. Psychology, Summa Cum Laude · 3.94 GPA — Montclair State University, with minors in neuroscience and cognitive science.",
    "SURFiN Fellow — Simons Foundation × Princeton Neuroscience Institute. Hidden circuit dynamics in recurrent neural networks.",
    "Founder & Director — IMAF & H Consulting, a 501(c)(3) advancing autism advocacy, education, and research.",
  ],
}

export const manifestoConfig: ManifestoConfig = {
  videoPath: "/videos/manifesto.mp4",
  text: "“Learning is a constant process of discovery — a process without end.” From ERP paradigms with children in the Autism & Neurodevelopment Lab to decoding hidden circuit dynamics in recurrent neural networks at Princeton, my work follows a single thread: the brain is a network of connections, and every signal it carries can be measured, modeled, and made to matter. I build the pipelines — acquisition, preprocessing, analysis — that turn raw neural data into answers, and I turn those answers into tools, training, and advocacy for the communities that need them most.",
}

export const facilitiesConfig: FacilitiesConfig = {
  sectionLabel: "Affiliations & Experience",
  detailBackText: "← Back to the network",
  detailNotFoundText: "Node not found in the network.",
  detailReturnText: "Return to index",
  items: [
    {
      slug: "child-mind-institute",
      name: "Child Mind Institute",
      code: "CMI",
      address: "New York, NY",
      status: "Neurobehavioral Analyst — 2025–Present",
      email: "housem@nothelp.help",
      phone: "201 213 1198",
      ctaText: "Visit childmind.org",
      ctaHref: "https://childmind.org",
      image: "/images/facility-cmi.jpg",
      utcOffset: -4,
      article: {
        title: "Neurobehavioral Analyst — Child Mind Institute",
        paragraphs: [
          "At the Child Mind Institute, I supervise the management, extraction, processing, and analysis of large-scale fMRI datasets — building the automation scripts in Bash, R, and Python that keep multi-site neuroimaging data moving from scanner to science.",
          "Day to day, I perform visual quality control on imaging data, support background research writing for investigators, and prepare and distribute biweekly internal data assessments that keep research teams aligned on data integrity.",
          "The role sits at the intersection of neuroimaging operations and reproducible science: FSL and FreeSurfer workflows, cortical reconstruction, and preprocessing pipelines — honed further through the University of Oxford FSL course and the Functional MRI Workshop at the Martinos Center for Biomedical Imaging.",
        ],
      },
    },
    {
      slug: "princeton-neuroscience-institute",
      name: "Simons Foundation × Princeton Neuroscience Institute",
      code: "PNI",
      address: "Princeton, NJ",
      status: "SURFiN Fellow · Research Assistant — 2024–2025",
      email: "housem@nothelp.help",
      phone: "",
      ctaText: "Visit PNI",
      ctaHref: "https://pni.princeton.edu",
      image: "/images/facility-pni.jpg",
      utcOffset: -4,
      article: {
        title: "SURFiN Fellow — Hidden Circuit Dynamics in Recurrent Neural Networks",
        paragraphs: [
          "As a SURFiN Fellow with the Simons Foundation at the Princeton Neuroscience Institute, I investigated hidden circuit dynamics within recurrent neural networks — asking how information is encoded in the moment-to-moment activity of neighboring cells.",
          "I developed linear decoders, analysis workflows, and computational models for neural and biological process analysis, culminating in the poster “The Neural Dynamics of Neighboring Cells,” presented at the Simons Foundation Undergraduate Symposium.",
          "The fellowship paired computational neuroscience training through Neuromatch Academy with close collaboration across the lab — work that now extends into decoding choice from neural dynamics in memory-guided tasks.",
        ],
      },
    },
    {
      slug: "autism-neurodevelopment-lab",
      name: "Autism & Neurodevelopment Lab — Montclair State University",
      code: "MSU",
      address: "Montclair, NJ",
      status: "Research Assistant — 2023–2025",
      email: "housem@nothelp.help",
      phone: "",
      ctaText: "Visit Montclair State",
      ctaHref: "https://www.montclair.edu",
      image: "/images/facility-msu.jpg",
      utcOffset: -4,
      article: {
        title: "Research Assistant — Autism & Neurodevelopment Lab",
        paragraphs: [
          "In the Autism & Neurodevelopment Lab, I engaged in EEG sessions with children, applying ERP CORE paradigms and establishing data-acquisition protocols that strengthened data integrity — work contributing to a forthcoming journal article on genetic contributions to autism and an APA Convention 2025 poster.",
          "The toolkit was broad: REDCap, Curry 7, MATLAB, and MNE-Python for acquisition and analysis, alongside clinical assessment and consent procedures including SRS, SSIS, and ADOS administration.",
          "Across campus, I also served as a neuromarketing consultant for the Feliciano School of Business — advising on EEG experiment design, setting up equipment and software, delivering training on EEG data analysis, and developing open-source solutions for galvanic skin response (GSR) recording.",
        ],
      },
    },
    {
      slug: "imaf-h-consulting",
      name: "IMAF & H Consulting",
      code: "501(C)(3)",
      address: "Boonton, NJ",
      status: "Founder & Director",
      email: "housem@nothelp.help",
      phone: "201 213 1198",
      ctaText: "Visit nothelp.help",
      ctaHref: "https://nothelp.help",
      image: "/images/facility-imaf.jpg",
      utcOffset: -4,
      article: {
        title: "Founder & Director — IMAF & H Consulting",
        paragraphs: [
          "IMAF & H Consulting is a 501(c)(3) I founded and direct — dedicated to fostering impactful change through advocacy, education, and innovative solutions, with a core focus on empowering individuals on the autism spectrum and their communities.",
          "The organization develops interventions and inclusion initiatives, spearheads ER2 program grant proposals, and organizes advocacy events and community fundraisers — pairing neurobehavioral evidence with practical, on-the-ground support.",
          "Its practice rests on three pillars: advocacy expertise that champions the causes that matter, educational insights delivered through accessible training and resources, and strategic, data-driven research that guides informed decision-making.",
        ],
      },
    },
  ],
}

export const observationConfig: ObservationConfig = {
  sectionLabel: "Signal Acquisition",
  videoPath: "/videos/observation.mp4",
  statusText: "Live — 64-CH EEG · 512 Hz",
  latLabel: "FREQ",
  lonLabel: "AMPL",
  initialLat: 10.24,
  initialLon: 24.61,
}

export const archivesConfig: ArchivesConfig = {
  sectionLabel: "Selected Publications & Presentations",
  vaultTitle: "Open the Archive",
  closeText: "Close the vault",
  items: [
    {
      src: "/images/archive-ei.jpg",
      label: "More Excitatory Than Inhibitory — E/I Imbalance in Autism · ABCT 2026",
    },
    {
      src: "/images/archive-rnn.jpg",
      label: "The Neural Dynamics of Neighboring Cells · Simons Foundation Undergraduate Symposium 2025",
    },
    {
      src: "/images/archive-martial.jpg",
      label: "Martial Arts as a Therapeutic Modality for Children with Autism · ABCT 2024",
    },
    {
      src: "/images/archive-bangladesh.jpg",
      label: "Legal & Institutional Barriers to Justice and Accountability · Change and Justice in Bangladesh, 2025",
    },
    {
      src: "/images/archive-ascii.jpg",
      label: "BLADE — ASCII Portrait · Personal Favorite, github.com/SABLISTER",
    },
  ],
}

export const footerConfig: FooterConfig = {
  copyrightText: "© 2026 Michael House — Neurobehavioral Analyst & Researcher",
  statusText: "housem@nothelp.help · michaelhouse.cv",
}
