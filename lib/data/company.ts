// Sermix company info — single source of truth for Contact, Order, Footer,
// and any other surface that needs phone/email/address/hours.
//
// TODO before launch:
//   - Confirm primary phone vs WhatsApp number with the client. Currently the
//     truck signage (01007790606) and CLAUDE.md WhatsApp deep link
//     (201012211929) disagree, so we treat them as two separate channels.
//   - Confirm the plant's exact street address — current value is a
//     placeholder for New Cairo's industrial zone.
//   - Confirm primary email; sermix.com.eg is on the truck side but the
//     mailbox is unverified.

export const company = {
  legalName: "Sermix Ready-Mix Concrete",
  shortName: "Sermix",
  foundedYear: 2009,

  phone: {
    // Tel-callable form (international, no spaces).
    href: "+201007790606",
    // Human-readable, grouped per CLAUDE.md (+20 prefix, space-separated).
    display: "+20 100 779 0606",
  },

  whatsapp: {
    // Sourced from CLAUDE.md gotchas — primary mobile-first contact channel.
    href: "https://wa.me/201012211929",
    display: "+20 101 221 1929",
  },

  email: {
    href: "mailto:info@sermix.com.eg",
    display: "info@sermix.com.eg",
  },

  address: {
    // TODO: replace with the plant's exact address before launch.
    line1: "Industrial Zone, New Cairo",
    line2: "Cairo Governorate, Egypt",
    full: "Industrial Zone, New Cairo, Cairo Governorate, Egypt",
  },

  // Map placeholder centred near New Cairo's industrial zone. Replace lat/lng
  // and zoom once the precise plant location is supplied.
  map: {
    lat: 30.0288,
    lng: 31.4789,
    zoom: 14,
  },

  hours: {
    // Sermix runs 24/7 ops (confirmed in CLAUDE.md and Stats band).
    twentyFourSeven: true,
    officeWindow: "Office hours: Sun–Thu, 09:00–18:00",
    officeWindow_ar: "ساعات المكتب: الأحد–الخميس، 09:00–18:00",
  },
} as const;
