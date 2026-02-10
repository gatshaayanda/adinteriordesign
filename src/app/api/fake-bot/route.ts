import { NextResponse } from "next/server";

type BotResponse = { reply: string; suggestions?: string[] };

const CONTACT = {
  whatsappNumber: "+26772971852",
};

const SOCIALS = {
  instagram: "https://www.instagram.com/p/DUTTKQjCCG6/",
  tiktok: "https://www.tiktok.com/@sparklelegacyinsurancebr/video/7568941327816068364",
  facebook: "https://www.facebook.com/p/Sparkle-Legacy-Insurance-Brokers-61557773288268/",
};

const PATHS = {
  shortTerm: "/c/short-term",
  longTerm: "/c/long-term",
  retirement: "/c/retirement",
  business: "/c/business",
  claims: "/claims",
  contact: "/contact",
};

const SUGG = {
  GET_QUOTE: "Get a quote",
  SHORT: "Short-Term cover",
  LONG: "Long-Term cover",
  RETIRE: "Retirement",
  SME: "SME cover",
  CLAIMS: "Claims help",
  WHATSAPP: "Talk on WhatsApp",
  CONTACT: "Contact",
  DOCS: "What documents are needed?",
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

// Phrase pools (Sparkle Legacy tone)
const tone = {
  greet: [
    "Hi 👋 You’re chatting with Sparkle Legacy.",
    "Hello 👋 Sparkle Legacy here — how can I help?",
    "Welcome 👋 I can help you understand cover, request a quote, or guide you on claims.",
  ],
  clarify: [
    "Quick one — is this for **Short-Term** (car/home/contents) or **Long-Term** (life/funeral/disability)?",
    "To guide you properly: do you need cover for a **thing** (car/home) or a **person/income** (life/funeral/disability)?",
  ],
  quote: [
    "I can help you request a quote. Tell me: **product**, **city/town**, and key details (e.g. car model, sum assured, dependants).",
    "For a quote, share: **cover type + product + city/town + notes**. If you prefer, tap “Talk on WhatsApp” and the site will format it neatly.",
  ],
  claims: [
    "For claims, tell me what happened and when — I’ll guide you on the usual steps and what documents are needed.",
    "No stress — for claims, we’ll start with: **incident date**, **what happened**, and **supporting evidence** (photos/forms).",
  ],
  docs: [
    "It depends on the product, but commonly: **ID**, **policy/quote reference** (if any), and **supporting documents** (forms/photos/medical/repair quotes). Tell me the product and I’ll be specific.",
    "Usually you’ll need: **ID + completed forms + supporting evidence**. Tell me the cover type (motor/home/funeral/life) and I’ll list the exact items.",
  ],
  socials: [
    `Here are Sparkle Legacy’s socials:\n• Instagram: ${SOCIALS.instagram}\n• TikTok: ${SOCIALS.tiktok}\n• Facebook: ${SOCIALS.facebook}`,
    `You can follow Sparkle Legacy here:\n• Instagram: ${SOCIALS.instagram}\n• TikTok: ${SOCIALS.tiktok}\n• Facebook: ${SOCIALS.facebook}`,
  ],
};

// Intents
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
      /\b(hola|dumela)\b/,
    ],
    respond: () => {
      memory.greeted = true;
      return reply(`${pick(tone.greet)}\nWhat do you need today?`, [
        SUGG.GET_QUOTE,
        SUGG.SHORT,
        SUGG.LONG,
        SUGG.CLAIMS,
        SUGG.WHATSAPP,
      ]);
    },
  },

  {
    name: "socials",
    weight: 4,
    matchers: [
      /\b(instagram|ig)\b/,
      /\b(tiktok|tik tok)\b/,
      /\b(facebook|fb)\b/,
      /\b(social|socials|links|pages)\b/,
    ],
    respond: () =>
      reply(pick(tone.socials), [
        SUGG.GET_QUOTE,
        SUGG.SHORT,
        SUGG.LONG,
        SUGG.WHATSAPP,
      ]),
  },

  {
    name: "quote",
    weight: 3,
    matchers: [/\b(quote|quotation|price|premium|how much|cost)\b/, /\b(cover|insurance)\b/],
    respond: () =>
      reply(
        `${pick(tone.quote)}\nBrowse:\n• Short-Term: ${PATHS.shortTerm}\n• Long-Term: ${PATHS.longTerm}`,
        [SUGG.GET_QUOTE, SUGG.SHORT, SUGG.LONG, SUGG.WHATSAPP, SUGG.DOCS]
      ),
  },

  {
    name: "short_term",
    weight: 3,
    matchers: [
      /\b(short[-\s]?term|motor|car|vehicle|third party|comprehensive|home|house|contents|travel|gadget|phone|liability)\b/,
    ],
    respond: () =>
      reply(
        `Short-Term insurance covers **things** (car, home & contents, travel, gadgets).\nBrowse here: ${PATHS.shortTerm}\nWhat product do you need a quote for?`,
        [SUGG.GET_QUOTE, SUGG.CLAIMS, SUGG.DOCS, SUGG.WHATSAPP]
      ),
  },

  {
    name: "long_term",
    weight: 3,
    matchers: [
      /\b(long[-\s]?term|life|funeral|dread|critical illness|disability|income|credit life|endowment|annuity)\b/,
    ],
    respond: () =>
      reply(
        `Long-Term insurance covers **people/income** (life, funeral, disability, dread disease, annuities).\nBrowse here: ${PATHS.longTerm}\nWhich product are you looking for?`,
        [SUGG.GET_QUOTE, SUGG.RETIRE, SUGG.DOCS, SUGG.WHATSAPP]
      ),
  },

  {
    name: "retirement",
    weight: 2,
    matchers: [/\b(retirement|pension|annuity|wealth|investment)\b/],
    respond: () =>
      reply(
        `Retirement & wealth planning helps you build long-term security (pensions/annuities).\nBrowse here: ${PATHS.retirement}\nDo you want a savings plan or an income plan?`,
        [SUGG.RETIRE, SUGG.GET_QUOTE, SUGG.WHATSAPP, SUGG.DOCS]
      ),
  },

  {
    name: "business",
    weight: 2,
    matchers: [/\b(business|sme|company|office|commercial|fleet)\b/],
    respond: () =>
      reply(
        `For businesses/SMEs, we can help with covers like assets, liability, fleet, and employee benefits.\nBrowse here: ${PATHS.business}\nWhat industry and what do you need protected?`,
        [SUGG.SME, SUGG.GET_QUOTE, SUGG.WHATSAPP, SUGG.DOCS]
      ),
  },

  {
    name: "claims",
    weight: 3,
    matchers: [/\b(claim|claims|accident|stolen|theft|damage|lost|injury)\b/],
    respond: () =>
      reply(
        `${pick(tone.claims)}\nClaims page: ${PATHS.claims}\nWhat product is it (motor/home/funeral/life) and what happened?`,
        [SUGG.CLAIMS, SUGG.DOCS, SUGG.WHATSAPP, SUGG.CONTACT]
      ),
  },

  {
    name: "documents",
    weight: 2,
    matchers: [/\b(document|documents|requirements|needed|need|form|forms|id|papers)\b/],
    respond: () =>
      reply(pick(tone.docs), [SUGG.DOCS, SUGG.GET_QUOTE, SUGG.CLAIMS, SUGG.WHATSAPP]),
  },

  {
    name: "contact",
    weight: 2,
    matchers: [/\b(contact|call|phone|whatsapp|talk|agent|advisor|help me)\b/],
    respond: () =>
      reply(
        `You can message us on WhatsApp: ${CONTACT.whatsappNumber}\nOr visit: ${PATHS.contact}`,
        [SUGG.WHATSAPP, SUGG.CONTACT, SUGG.GET_QUOTE]
      ),
  },
];

const FALLBACK = () =>
  reply(
    pick([
      pick(tone.clarify),
      "Tell me what you need help with: **quote**, **claims**, or **understanding cover** — and the product (motor/home/funeral/life/retirement).",
      `If you want, message us directly on WhatsApp: ${CONTACT.whatsappNumber}`,
    ]),
    [SUGG.GET_QUOTE, SUGG.SHORT, SUGG.LONG, SUGG.CLAIMS, SUGG.WHATSAPP]
  );

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
  let raw = "";

  try {
    const body = await req.json();
    raw = String(body?.message ?? "");
    text = normalize(raw);
  } catch {}

  // Empty message: greet + menu
  if (!text) {
    return NextResponse.json(
      reply(`${pick(tone.greet)}\nWhat can I help you with?`, [
        SUGG.GET_QUOTE,
        SUGG.SHORT,
        SUGG.LONG,
        SUGG.CLAIMS,
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
        `Sure — WhatsApp is ${CONTACT.whatsappNumber}.\nTell me what you need: quote / claim / policy help.`,
        [SUGG.WHATSAPP, SUGG.GET_QUOTE, SUGG.CLAIMS]
      )
    );
  }

  // Edge-case: typed known path phrase
  if (includesAny(text, ["short term", "short-term"])) {
    return NextResponse.json(
      INTENTS.find((i) => i.name === "short_term")!.respond(text)
    );
  }
  if (includesAny(text, ["long term", "long-term"])) {
    return NextResponse.json(
      INTENTS.find((i) => i.name === "long_term")!.respond(text)
    );
  }

  return NextResponse.json(FALLBACK());
}
