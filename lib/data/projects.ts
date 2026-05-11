// Sermix project portfolio. Order here drives both the home grid (first 6) and
// the /projects index. Real client names + photos come from the supplied
// images/Projects/ folder. Two additional placeholder entries round out the
// list to nine (six on home, full set on /projects).
//
// TODO before launch: client to confirm public use of named projects, supply
// commissioned project photography, and provide accurate volumes / years for
// each. Arabic strings are placeholder translations.

export type ProjectCategory =
  | "residential"
  | "commercial"
  | "infrastructure"
  | "institutional"
  | "industrial";

export type Project = {
  slug: string;
  name: string;
  name_ar: string;
  category: ProjectCategory;
  category_label: string;
  category_label_ar: string;
  client: string;
  location: string;
  year: number;
  volume: string; // e.g. "2,400 m³", kept LTR even in AR contexts
  coverImage: string;
  heroImage: string;
  scope: string[]; // service slugs from lib/data/services.ts
  description: string;
  description_ar: string;
  gallery: string[];
};

export const projects: readonly Project[] = [
  {
    slug: "mivida",
    name: "Mivida",
    name_ar: "ميفيدا",
    category: "residential",
    category_label: "Residential",
    category_label_ar: "سكني",
    client: "Emaar Misr",
    location: "New Cairo",
    year: 2022,
    volume: "42,000 m³",
    coverImage: "/images/projects/mivida.png",
    heroImage: "/images/projects/mivida.png",
    scope: ["ready-mix-concrete", "concrete-pumps", "transit-mixers"],
    description:
      "Ongoing concrete supply across multiple Mivida residential phases. Sermix delivered structural and high-performance mixes for villas, apartment blocks, and shared infrastructure, with continuous truck rotation to match the developer's sequencing.",
    description_ar:
      "توريد خرساني مستمر لمراحل ميفيدا السكنية المتعددة. وفّرت سيرمكس خلطات إنشائية وعالية الأداء للفلل والعمارات والبنية المشتركة، مع تتابع شاحنات منتظم يواكب جدول المطور.",
    gallery: [
      "/images/projects/mivida.png",
      "/images/projects/90-avenue.png",
      "/images/projects/red-con-construction.png",
    ],
  },
  {
    slug: "cairo-festival-city",
    name: "Cairo Festival City",
    name_ar: "كايرو فستيفال سيتي",
    category: "commercial",
    category_label: "Commercial",
    category_label_ar: "تجاري",
    client: "Al-Futtaim Group",
    location: "New Cairo",
    year: 2021,
    volume: "28,500 m³",
    coverImage: "/images/projects/cfc.png",
    heroImage: "/images/projects/cfc.png",
    scope: ["ready-mix-concrete", "concrete-pumps", "cube-crushing-lab"],
    description:
      "Mixed-use commercial expansion at Cairo Festival City. Sermix supplied retail anchors and structured parking with a focus on high-slump mixes for complex form work and tight finishing schedules.",
    description_ar:
      "توسعة تجارية متعددة الاستخدام في كايرو فستيفال سيتي. وفّرت سيرمكس خلطات للأنشطة التجارية الرئيسية ومواقف السيارات المنظمة، مع تركيز على خلطات عالية الانسياب للقوالب المعقدة وجداول التشطيب الضيقة.",
    gallery: [
      "/images/projects/cfc.png",
      "/images/projects/evolve-creative-studios.png",
    ],
  },
  {
    slug: "brt-corridor",
    name: "BRT Corridor",
    name_ar: "ممر الحافلات السريعة",
    category: "infrastructure",
    category_label: "Infrastructure",
    category_label_ar: "بنية تحتية",
    client: "Ministry of Transport",
    location: "Greater Cairo",
    year: 2023,
    volume: "61,000 m³",
    coverImage: "/images/projects/brt.png",
    heroImage: "/images/projects/brt.png",
    scope: ["ready-mix-concrete", "truck-scale", "transit-mixers"],
    description:
      "Bus Rapid Transit corridor, viaducts, station decks, and pavement. The work demanded continuous overnight pours, fast-track strength gain, and accurate batch records pulled from the on-site truck scale.",
    description_ar:
      "ممر الحافلات السريعة, جسور علوية، وأرضيات محطات، ورصف. تطلّب العمل عمليات صب ليلية متواصلة، وكسبًا سريعًا للقوة، وسجلات حمولات دقيقة من ميزان الشاحنات في الموقع.",
    gallery: [
      "/images/projects/brt.png",
      "/images/projects/state-cases-authority.png",
    ],
  },
  {
    slug: "chinese-university",
    name: "Chinese University Campus",
    name_ar: "جامعة الصين",
    category: "institutional",
    category_label: "Institutional",
    category_label_ar: "مؤسسي",
    client: "Egyptian Chinese University",
    location: "Sokhna Road",
    year: 2022,
    volume: "18,200 m³",
    coverImage: "/images/projects/chinese-university.png",
    heroImage: "/images/projects/chinese-university.png",
    scope: ["ready-mix-concrete", "cube-crushing-lab"],
    description:
      "Academic buildings and laboratories on a hillside campus. Mix designs were tuned for thermal mass and exposed surfaces, with the Sermix lab running batch certifications inside 28 days for each pour.",
    description_ar:
      "مبانٍ أكاديمية ومعامل في حرم جامعي على هضبة. تمّ ضبط تصاميم الخلطات للكتلة الحرارية والأسطح الظاهرة، مع تشغيل معمل سيرمكس لشهادات الحمولات خلال 28 يومًا لكل عملية صب.",
    gallery: [
      "/images/projects/chinese-university.png",
      "/images/projects/cfc.png",
    ],
  },
  {
    slug: "state-cases-authority",
    name: "State Cases Authority",
    name_ar: "هيئة قضايا الدولة",
    category: "institutional",
    category_label: "Institutional",
    category_label_ar: "مؤسسي",
    client: "State Cases Authority",
    location: "New Administrative Capital",
    year: 2023,
    volume: "9,800 m³",
    coverImage: "/images/projects/state-cases-authority.png",
    heroImage: "/images/projects/state-cases-authority.png",
    scope: ["ready-mix-concrete", "cube-crushing-lab"],
    description:
      "Government services building in the New Administrative Capital. The brief required certified high-strength concrete and full traceability per pour, lab tickets archived against batch numbers for the project's lifetime audit.",
    description_ar:
      "مبنى خدمات حكومي في العاصمة الإدارية الجديدة. تطلّب المشروع خرسانة معتمدة عالية المقاومة وتتبّعًا كاملاً لكل عملية صب, أرشفة بطاقات المعمل مقابل أرقام الحمولات لتدقيق طوال عمر المشروع.",
    gallery: [
      "/images/projects/state-cases-authority.png",
      "/images/projects/brt.png",
    ],
  },
  {
    slug: "ninety-avenue",
    name: "90 Avenue",
    name_ar: "ناينتي افنيو",
    category: "residential",
    category_label: "Residential",
    category_label_ar: "سكني",
    client: "Tabarak Holding",
    location: "Fifth Settlement",
    year: 2023,
    volume: "15,400 m³",
    coverImage: "/images/projects/90-avenue.png",
    heroImage: "/images/projects/90-avenue.png",
    scope: ["ready-mix-concrete", "concrete-pumps"],
    description:
      "Residential compound across the Fifth Settlement spine. Sermix coordinated tower-by-tower deliveries with the contractor's pump scheduling to compress the structural envelope of each block.",
    description_ar:
      "مجمع سكني على امتداد التجمع الخامس. نسّقت سيرمكس عمليات التوريد برجًا برجًا مع جدول مضخات المقاول لاختصار الهيكل الإنشائي لكل عمارة.",
    gallery: [
      "/images/projects/90-avenue.png",
      "/images/projects/mivida.png",
    ],
  },
  {
    slug: "evolve-creative-studios",
    name: "Evolve Creative Studios",
    name_ar: "إيفولف للاستوديوهات الإبداعية",
    category: "commercial",
    category_label: "Commercial",
    category_label_ar: "تجاري",
    client: "Evolve",
    location: "New Cairo",
    year: 2024,
    volume: "4,600 m³",
    coverImage: "/images/projects/evolve-creative-studios.png",
    heroImage: "/images/projects/evolve-creative-studios.png",
    scope: ["ready-mix-concrete", "transit-mixers"],
    description:
      "Boutique commercial development with exposed concrete finishes throughout. Mix design and curing schedule were tuned together with the architect to keep surface variation inside the project's tight visual tolerance.",
    description_ar:
      "تطوير تجاري بطابع خاص يعتمد التشطيبات الخرسانية الظاهرة. تمّ ضبط تصميم الخلطة وجدول المعالجة بالتعاون مع المعماري لإبقاء تفاوت الأسطح ضمن الحد البصري الصارم للمشروع.",
    gallery: [
      "/images/projects/evolve-creative-studios.png",
      "/images/projects/cfc.png",
    ],
  },
  {
    slug: "red-con-construction",
    name: "Red Con Construction HQ",
    name_ar: "ريد كون للمقاولات",
    category: "industrial",
    category_label: "Industrial",
    category_label_ar: "صناعي",
    client: "Red Con Construction",
    location: "Tenth of Ramadan",
    year: 2022,
    volume: "12,800 m³",
    coverImage: "/images/projects/red-con-construction.png",
    heroImage: "/images/projects/red-con-construction.png",
    scope: ["ready-mix-concrete", "transit-mixers", "truck-scale"],
    description:
      "Headquarters and yard expansion for a long-standing construction client. Heavy-duty industrial slabs, sequenced pours across active operations, and full weighbridge logging through Sermix dispatch.",
    description_ar:
      "مقر وتوسعة ساحة لعميل إنشاءات قديم. أرضيات صناعية ثقيلة، وعمليات صب متتابعة وسط نشاط متواصل، مع تسجيل كامل عبر ميزان الشاحنات بإدارة دفعات سيرمكس.",
    gallery: [
      "/images/projects/red-con-construction.png",
      "/images/projects/brt.png",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return projects[0]!;
  return projects[(idx + 1) % projects.length]!;
}
