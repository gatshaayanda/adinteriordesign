import { NextResponse } from "next/server";

type BotResponse = { reply: string; suggestions?: string[] };

const CONTACT = {
  whatsappNumber: "+267 77 807 112",
};

// Put the REAL AD links here later (do NOT ship wrong socials)
const SOCIALS = {
  instagram: "",
  tiktok: "",
  facebook: "",
};

const PATHS = {
  services: "/services",
  gallery: "/gallery",
  contact: "/contact",
};

const SUGG = {
  GET_QUOTE: "Get a quote",
  TV_STAND: "TV Stand / Wall Unit",
  PANELS: "Wall Panels",
  WARDROBES: "Wardrobes",
  KITCHEN: "Kitchen",
  PRICING: "Pricing / Estimate",
  MEASUREMENTS: "What measurements do you need?",
  TIMELINE: "How long does it take?",
  WHATSAPP: "Talk on WhatsApp",
  GALLERY: "See Gallery",
  CONTACT: "Contact",
  MATERIALS: "Finishes & materials",
  LOCATION: "Where are you based?",
  SOCIALS: "Social links",
} as const;

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const reply = (text: string, suggestions?: string[]): BotResponse => ({
  reply: text.trim(),
  suggestions,
});

const normalize = (s: unknown): string =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const includesAny = (s: string, pats: (string | RegExp)[]) =>
  pats.some((p) => (p instanceof RegExp ? p.test(s) : s.includes(p)));

// Small in-memory context (server-side only; resets on cold start)
let memory: { greeted?: boolean; lastIntent?: string } = {};

const tone = {
  greet: [
    "Hi 👋 You’re chatting with AD Interior Design.",
    "Hello 👋 AD Interior Design here — what are you looking to build?",
    "Welcome 👋 I can help you get a quote fast (TV stands, wall panels, wardrobes, kitchens).",
  ],
  quote: [
    "I can help you get an estimate. Tell me: **project type**, **city/town**, and **rough measurements**.",
    "For a quote, share: **what you want**, **space**, **city/town**, and any **photos/inspo**.",
  ],
  measurements: [
    "For a quick quote, send:\n• **Wall width & height** (or the area)\n• **TV size** (if TV stand)\n• Any **plug points / sockets** location\n• Photos/video of the space\n• Finish: **slats / marble / gloss / matte / wood tone**",
    "Measurements that help most:\n• Width × height of the wall/space\n• TV size + soundbar (if any)\n• Preferred storage (drawers / floating)\n• Finish choice (slats/marble/wood)\n• Photos/video of the space",
  ],
  timeline: [
    "Timeline depends on the design + workload. If you tell me your **project type** and **city**, I can give a realistic estimate.",
    "Most builds depend on materials + design complexity. Share what you need and when you need it, and we’ll advise the earliest slot.",
  ],
  materials: [
    "We can do premium finishes like **slat panels**, **marble panels**, **floating units**, and clean **LED underglow** looks. Tell me the style you want and I’ll guide you.",
    "Finishes can be **gloss** or **matte**, wood tones, slats, marble panels, and custom storage layouts. Share a reference photo and we’ll match the vibe.",
  ],
  location: [
    "We’re based in Botswana. Tell me your **city/town** and we’ll advise on delivery/installation.",
    "Share your **city/town** and we’ll confirm availability for install.",
  ],
  pricing: [
    "Pricing depends on size + finish + storage + installation. The fastest way is: share measurements + a photo, and we’ll quote.",
    "To estimate, I need: **wall size**, **project type**, and your preferred finish (slats/marble/gloss/matte).",
  ],
  contact: [
    `Fastest way: WhatsApp us here: ${CONTACT.whatsappNumber}`,
    `You can WhatsApp for a quote: ${CONTACT.whatsappNumber}`,
  ],
  socials: [
    "Social links will be added here. For now, the fastest contact is WhatsApp.",
    "We’ll add the official social links on the site shortly. Use WhatsApp for immediate help.",
  ],
  fallback: [
    "Tell me what you want to build: **TV stand**, **wall panels**, **wardrobes**, or a **kitchen** — and your city/town.",
    `For the fastest response, WhatsApp us: ${CONTACT.whatsappNumber}`,
    "If you share a photo/video of the space + rough measurements, I can format a clean quote request for WhatsApp.",
  ],
};

type Intent = {
  name: string;
  weight: number;
  matchers: (string | RegExp)[];
  respond: (text: string) => BotResponse;
};

const INTENTS: Intent[] = [
  {
    name: "greeting",
    weight: 4,
    matchers: [
      /\b(hello|hi|hey|morning|afternoon|evening|start|help|menu)\b/,
      /\b(dumela|thobela)\b/,
    ],
    respond: () => {
      memory.greeted = true;
      return reply(`${pick(tone.greet)}\n\nChoose one:`, [
        SUGG.GET_QUOTE,
        SUGG.TV_STAND,
        SUGG.PANELS,
        SUGG.WARDROBES,
        SUGG.KITCHEN,
        SUGG.WHATSAPP,
      ]);
    },
  },

  {
    name: "services",
    weight: 4,
    matchers: [
      /\b(service|services|what do you do|do you do|build|make|carpentry|interior)\b/,
      /\b(tv stand|tv unit|wall unit|slat|slats|wall panel|panels|marble|wardrobe|closet|kitchen|cabinet|cupboard)\b/,
    ],
    respond: () =>
      reply(
        `We do custom interior builds such as:\n• TV stands / wall units\n• Slat wall panels & marble feature walls\n• Wardrobes / closets\n• Kitchens & cabinets\n\nYou can also browse:\n• Services: ${PATHS.services}\n• Gallery: ${PATHS.gallery}\n\nWhat are you interested in?`,
        [SUGG.GET_QUOTE, SUGG.GALLERY, SUGG.MEASUREMENTS, SUGG.WHATSAPP]
      ),
  },

  {
    name: "quote",
    weight: 4,
    matchers: [/\b(quote|quotation|price|pricing|how much|cost|estimate|budget)\b/],
    respond: () =>
      reply(
        `${pick(tone.quote)}\n\nIf you want, I can guide you on measurements first.`,
        [SUGG.MEASUREMENTS, SUGG.GET_QUOTE, SUGG.WHATSAPP, SUGG.GALLERY]
      ),
  },

  {
    name: "measurements",
    weight: 4,
    matchers: [/\b(measure|measurement|size|sizes|dimensions|width|height|cm|mm|meter|metre)\b/],
    respond: () =>
      reply(pick(tone.measurements), [SUGG.GET_QUOTE, SUGG.WHATSAPP, SUGG.GALLERY]),
  },

  {
    name: "timeline",
    weight: 3,
    matchers: [/\b(when|how long|timeline|duration|days|weeks|availability|available)\b/],
    respond: () =>
      reply(pick(tone.timeline), [SUGG.GET_QUOTE, SUGG.WHATSAPP, SUGG.CONTACT]),
  },

  {
    name: "materials",
    weight: 3,
    matchers: [/\b(material|materials|finish|finishes|color|colour|gloss|matte|wood|slat|marble|led)\b/],
    respond: () =>
      reply(pick(tone.materials), [SUGG.GET_QUOTE, SUGG.GALLERY, SUGG.WHATSAPP]),
  },

  {
    name: "location",
    weight: 3,
    matchers: [/\b(where|location|based|gaborone|mogoditshane|town|city|area)\b/],
    respond: () =>
      reply(pick(tone.location), [SUGG.GET_QUOTE, SUGG.WHATSAPP, SUGG.CONTACT]),
  },

  {
    name: "gallery",
    weight: 3,
    matchers: [/\b(gallery|photos|portfolio|examples|work|projects|images|pictures)\b/],
    respond: () =>
      reply(
        `You can browse our work here: ${PATHS.gallery}\n\nIf you tell me what style you like (slats/marble/wood), I can suggest a direction.`,
        [SUGG.GALLERY, SUGG.TV_STAND, SUGG.PANELS, SUGG.WHATSAPP]
      ),
  },

  {
    name: "socials",
    weight: 2,
    matchers: [/\b(instagram|ig|tiktok|tik tok|facebook|fb|social|socials|links|pages)\b/],
    respond: () => reply(pick(tone.socials), [SUGG.WHATSAPP, SUGG.CONTACT, SUGG.GALLERY]),
  },

  {
    name: "contact",
    weight: 4,
    matchers: [/\b(contact|call|phone|whatsapp|wa|chat|talk|help me)\b/],
    respond: () =>
      reply(`${pick(tone.contact)}\nContact page: ${PATHS.contact}`, [
        SUGG.WHATSAPP,
        SUGG.CONTACT,
        SUGG.GET_QUOTE,
      ]),
  },
];

const FALLBACK = () =>
  reply(pick(tone.fallback), [
    SUGG.GET_QUOTE,
    SUGG.TV_STAND,
    SUGG.PANELS,
    SUGG.WARDROBES,
    SUGG.KITCHEN,
    SUGG.WHATSAPP,
  ]);

function detectIntent(text: string): Intent | null {
  const scores = INTENTS.map((intent) => {
    const hits = intent.matchers.reduce(
      (acc, m) => (includesAny(text, [m]) ? acc + 1 : acc),
      0
    );
    return { intent, score: hits * intent.weight };
  });

  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  return top && top.score > 0 ? top.intent : null;
}

export async function POST(req: Request) {
  let text = "";

  try {
    const body = await req.json();
    const raw = String(body?.message ?? "");
    text = normalize(raw);
  } catch {}

  if (!text) {
    return NextResponse.json(
      reply(`${pick(tone.greet)}\n\nWhat do you want to build?`, [
        SUGG.GET_QUOTE,
        SUGG.TV_STAND,
        SUGG.PANELS,
        SUGG.WARDROBES,
        SUGG.KITCHEN,
        SUGG.WHATSAPP,
      ])
    );
  }

  const intent = detectIntent(text);
  if (intent) {
    memory.lastIntent = intent.name;
    return NextResponse.json(intent.respond(text));
  }

  // Edge-case: WhatsApp keyword
  if (includesAny(text, ["whatsapp", "wa", "chat"])) {
    return NextResponse.json(
      reply(
        `Sure — WhatsApp is ${CONTACT.whatsappNumber}.\nTell me what you want to build (TV stand / wall panels / wardrobes / kitchen).`,
        [SUGG.WHATSAPP, SUGG.GET_QUOTE, SUGG.MEASUREMENTS]
      )
    );
  }

  return NextResponse.json(FALLBACK());
}
