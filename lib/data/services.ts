// Sermix services. Edit here, not in the component.
//
// The home Services bento (components/marketing/Services.tsx) maps services
// with `feature: true` to larger tiles. The /services page (services/page.tsx)
// renders a deep section per service using `longDescription`, `image`, and
// `keyFacts` — these fields are only consumed there.
//
// TODO: replace short/long descriptions and key-fact values with
// client-supplied copy before launch. Arabic strings are placeholder
// translations until the client provides AR copy.

export type ServiceFact = {
  label: string;
  label_ar: string;
  value: string;
  value_ar: string;
};

export type Service = {
  slug: string;
  name: string;
  name_ar: string;
  shortDescription: string;
  shortDescription_ar: string;
  longDescription: string;
  longDescription_ar: string;
  image: string;
  imageAlt: string;
  imageAlt_ar: string;
  keyFacts: ReadonlyArray<ServiceFact>;
  feature: boolean;
};

export const services: readonly Service[] = [
  {
    slug: "ready-mix-concrete",
    name: "Ready-Mix Concrete",
    name_ar: "خرسانة جاهزة",
    shortDescription:
      "Tested mix designs delivered on schedule across Greater Cairo, from standard structural to high-performance.",
    shortDescription_ar:
      "تصاميم خلطات معتمدة تُسلَّم في موعدها في كل أنحاء القاهرة الكبرى، من الإنشائية القياسية إلى عالية الأداء.",
    longDescription:
      "Our core product. Every load is batched against the engineer's spec, weighed twice — at the plant and at the site — and logged against a ticket that ties back to the cubes pulled at delivery. Whether it's a single villa pour or a multi-week infrastructure programme, the mix arrives the same way: on schedule, on slump, and traceable.",
    longDescription_ar:
      "منتجنا الأساسي. تُخلط كل حمولة وفق مواصفة المهندس، وتُوزن مرتين — في المحطة وفي الموقع — وتُسجَّل ببطاقة مرتبطة بمكعبات الاختبار المسحوبة عند التسليم. سواء كانت عملية صب فيلا واحدة أو برنامج بنية تحتية متعدد الأسابيع، تصل الخلطة على نفس النهج: في وقتها، على الانسياب المطلوب، وقابلة للتتبع.",
    image: "/images/concrete_bag.png",
    imageAlt: "Sermix-branded cement bag with mortar and trowel",
    imageAlt_ar: "كيس أسمنت سيرمكس مع مونة ومسطرين",
    keyFacts: [
      { label: "Grades", label_ar: "الدرجات", value: "C20 – C50+", value_ar: "C20 – C50+" },
      { label: "Plant capacity", label_ar: "طاقة المحطة", value: "120 m³/hr", value_ar: "120 م³/ساعة" },
      { label: "Mix design", label_ar: "تصميم الخلطة", value: "Per pour, lab-signed", value_ar: "لكل عملية صب، باعتماد المعمل" },
    ],
    feature: true,
  },
  {
    slug: "truck-scale",
    name: "Truck Scale",
    name_ar: "ميزان شاحنات",
    shortDescription:
      "Calibrated weighbridge on site — every load logged, every ticket auditable.",
    shortDescription_ar:
      "ميزان شاحنات معاير في الموقع — كل حمولة مسجَّلة، وكل إيصال قابل للتدقيق.",
    longDescription:
      "A certified weighbridge inside the plant, calibrated and routinely audited. Every mixer crosses the scale twice: at batch and at site. The combination gives the contractor an unambiguous record of what left and what arrived — and gives Sermix dispatch the trust signal needed when a contractor is comparing tickets across suppliers.",
    longDescription_ar:
      "ميزان شاحنات معتمد داخل المحطة، معاير ويخضع للتدقيق الدوري. تعبر كل خلاطة الميزان مرتين: عند الخلط وفي الموقع. تمنح هذه المعادلة المقاول سجلًا قاطعًا لما خرج وما وصل — وتمنح إدارة سيرمكس إشارة الثقة التي يحتاجها المقاول عند المقارنة بين تذاكر الموردين.",
    image: "/images/sermix_truck_cement.jpg",
    imageAlt: "Sermix mixers lined at the batching plant",
    imageAlt_ar: "خلاطات سيرمكس مصطفة في محطة الخلط",
    keyFacts: [
      { label: "Certification", label_ar: "الاعتماد", value: "Calibrated weighbridge", value_ar: "ميزان شاحنات معاير" },
      { label: "Weighing", label_ar: "الوزن", value: "Twice per load", value_ar: "مرتان لكل حمولة" },
      { label: "Audit", label_ar: "التدقيق", value: "Tickets retained per project", value_ar: "حفظ التذاكر لكل مشروع" },
    ],
    feature: true,
  },
  {
    slug: "cube-crushing-lab",
    name: "Cube Crushing Lab",
    name_ar: "معمل اختبار المكعبات",
    shortDescription:
      "In-house compressive-strength testing — no third-party delays, results inside 28 days.",
    shortDescription_ar:
      "اختبار مقاومة الانضغاط داخل الشركة — دون تأخير من جهات خارجية، نتائج خلال 28 يومًا.",
    longDescription:
      "We pull cubes from every batch, cure them on site, and crush them inside our own lab on the 7-, 14-, and 28-day cycles. No queueing behind another contractor's submissions at a shared lab, no third-party turnaround risk. Every cube is tagged to its dispatch ticket, so when the engineer asks for the strength record of a specific pour, we hand back the chain in minutes.",
    longDescription_ar:
      "نسحب مكعبات اختبار من كل دفعة، ونعالجها في الموقع، ونكسرها في معملنا الخاص على دورات 7 و14 و28 يومًا. دون انتظار خلف طلبات مقاول آخر في معمل مشترك، ودون مخاطر زمن الإرجاع لجهات خارجية. كل مكعب مرتبط ببطاقة الإرسال الخاصة به، فعندما يطلب المهندس سجل مقاومة عملية صب بعينها، نسلّم السلسلة كاملة في دقائق.",
    image: "/images/cube_crushing_lab.jpg",
    imageAlt: "Concrete cube being water-quenched after testing",
    imageAlt_ar: "مكعب خرساني تحت اختبار في معمل سيرمكس",
    keyFacts: [
      { label: "Test cycle", label_ar: "دورة الاختبار", value: "7 / 14 / 28 days", value_ar: "7 / 14 / 28 يومًا" },
      { label: "Tagging", label_ar: "الربط", value: "Per dispatch ticket", value_ar: "لكل بطاقة إرسال" },
      { label: "Turnaround", label_ar: "زمن التسليم", value: "No third-party queue", value_ar: "دون انتظار جهة خارجية" },
    ],
    feature: true,
  },
  {
    slug: "concrete-pumps",
    name: "Concrete Pumps",
    name_ar: "مضخات الخرسانة",
    shortDescription:
      "Boom and line pumps sized to the pour — high-rise reach, hard-to-access sites.",
    shortDescription_ar:
      "مضخات بذراع وخراطيم بأحجام تناسب الصب — تصل للارتفاعات العالية والمواقع الصعبة.",
    longDescription:
      "Boom and line pumps coordinated with our mixer rotation. We size the pump to the pour rate and the site geometry — a 36-metre boom for a typical residential structural pour, longer reach for high-rise or restricted-access work. Pump scheduling, mixer dispatch, and weighbridge logging are run from the same desk, so a delay at one end is absorbed before it reaches the site.",
    longDescription_ar:
      "مضخات بذراع وخراطيم تُنسَّق مع دوران خلاطاتنا. نختار المضخة بحسب معدل الصب وهندسة الموقع — ذراع 36 مترًا لعملية صب إنشائية سكنية اعتيادية، ومدى أطول للارتفاعات العالية أو المواقع المقيدة. تُدار جدولة المضخات وإرسال الخلاطات وتسجيل ميزان الشاحنات من المكتب نفسه، فيتم استيعاب أي تأخير قبل وصوله إلى الموقع.",
    image: "/images/concrete_pump.png",
    imageAlt: "Sermix boom pump positioned on site",
    imageAlt_ar: "مضخة سيرمكس بذراع جاهزة في الموقع",
    keyFacts: [
      { label: "Boom reach", label_ar: "مدى الذراع", value: "Up to 50 m", value_ar: "حتى 50 م" },
      { label: "Pump types", label_ar: "أنواع المضخات", value: "Boom + line", value_ar: "بذراع وخراطيم" },
      { label: "Coordination", label_ar: "التنسيق", value: "Single dispatch desk", value_ar: "مكتب إرسال موحَّد" },
    ],
    feature: false,
  },
  {
    slug: "transit-mixers",
    name: "Transit Mixers",
    name_ar: "خلاطات النقل",
    shortDescription:
      "Fleet of 8m³ and 10m³ mixers running 24/7 from the New Cairo plant.",
    shortDescription_ar:
      "أسطول من خلاطات 8 و10 متر مكعب تعمل على مدار الساعة من محطة القاهرة الجديدة.",
    longDescription:
      "An 8 m³ and 10 m³ mixer fleet running rotation off the New Cairo plant. Dispatch is staffed 24/7, with night shifts standard rather than premium — large infrastructure pours, fast-track projects, and consecutive-block residential sequencing all happen routinely on overnight slots. Mixer maintenance is in-house so a vehicle issue is hours away from a swap, not days.",
    longDescription_ar:
      "أسطول خلاطات بسعة 8 و10 متر مكعب يعمل بنظام تناوب من محطة القاهرة الجديدة. الإرسال متاح على مدار الساعة، والمناوبات الليلية معتادة لا استثنائية — عمليات الصب الكبيرة للبنية التحتية، والمشاريع المضغوطة، وتعاقب العمارات السكنية تجري كلها بشكل اعتيادي في فترات ليلية. صيانة الخلاطات داخل الشركة، فمعالجة عطل في مركبة هي مسألة ساعات لا أيام.",
    image: "/images/hero-truck.jpg",
    imageAlt: "Sermix mixer at the New Cairo batching plant",
    imageAlt_ar: "خلاطة سيرمكس في محطة القاهرة الجديدة",
    keyFacts: [
      { label: "Fleet sizes", label_ar: "أحجام الأسطول", value: "8 m³ + 10 m³", value_ar: "8 م³ + 10 م³" },
      { label: "Dispatch", label_ar: "الإرسال", value: "24 / 7", value_ar: "24 / 7" },
      { label: "Maintenance", label_ar: "الصيانة", value: "In-house workshop", value_ar: "ورشة داخلية" },
    ],
    feature: false,
  },
];
