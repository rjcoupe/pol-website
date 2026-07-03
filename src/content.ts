export interface SectionHeadContent {
  kicker: string;
  title: string;
  lead?: string;
}

export interface Package {
  name: string;
  desc: string;
  fromPrice: number;
  items: string[];
  featured?: boolean;
  badge?: string;
}

export const brand = {
  name: 'Proof of Life',
  tagline: 'Mobile Cocktail Co.',
  ctaLabel: 'Message to book',
  whatsapp: '447403603638',
  whatsappDisplay: '+44 7403 603638',
  website: 'proofoflife.bar',
  copyright: '© 2026 Proof of Life · Mobile Cocktail Co.',
};

export const waLink = `https://wa.me/${brand.whatsapp}`;

export const nav: { label: string; href: string }[] = [
  { label: 'What we do', href: '#what' },
  { label: 'Events', href: '#events' },
  { label: 'Packages', href: '#packages' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
];

export const hero = {
  kicker: 'Mobile bar hire · UK',
  lead: 'A proper cocktail bar that comes to you. One bartender, the right spirits — plus beer, wine and soft drinks — and a little warmth, for the smaller, closer gatherings where every drink actually matters.',
  ctaSecondary: 'See packages',
  stats: [
    { big: 'Intimate', small: 'weddings' },
    { big: 'Private', small: 'parties' },
    { big: 'Small', small: 'gatherings' },
  ],
  image: { src: '/images/ph-hero.png', alt: 'The Proof of Life bar in action' },
};

export const features = {
  head: {
    kicker: 'What we do',
    title: 'A full bar, brought to you.',
    lead: "Mobile cocktail bar hire for events that deserve more than a fridge full of warm cans. Cocktails are our craft — with beer, wine and soft drinks always on hand — and one bartender on it all night, so a smaller gathering feels properly looked after.",
  } satisfies SectionHeadContent,
  cards: [
    {
      index: '01',
      title: 'We bring everything',
      body: "Bar, glassware, ice, garnish, spirits and mixers — the whole setup arrives, gets built, and leaves without a trace. You don't lift a thing.",
    },
    {
      index: '02',
      title: 'One bartender who knows',
      body: 'A single experienced pair of hands behind the bar — fast, friendly, and unhurried with a smaller crowd. Proper technique, no theatrics unless you ask.',
    },
    {
      index: '03',
      title: "A menu that's yours",
      body: "Two house signatures or a short bespoke list built around your taste and your guests. Cocktails lead, but there's chilled beer, wine and soft drinks on the bar too — and proper alcohol-free serves always included.",
    },
  ],
};

export const events = {
  head: {
    kicker: 'Where we pour',
    title: 'Made for the small ones.',
    lead: "The kind of nights where it's about the people, not the headcount — twelve around a kitchen island, forty in a back garden.",
  } satisfies SectionHeadContent,
  cards: [
    {
      title: 'Intimate weddings',
      body: 'A signature his-and-hers serve and an arrival drink, for the close-knit celebrations.',
      image: '/images/ph-2.png',
      alt: 'Cocktails at an intimate wedding',
    },
    {
      title: 'Private parties',
      body: 'Birthdays, anniversaries, garden gatherings — turn an evening into an event.',
      image: '/images/ph-1.png',
      alt: 'A private party in full swing',
    },
    {
      title: 'Small gatherings',
      body: 'Launches, dinners and get-togethers that want a proper drink and a personal touch.',
      image: '/images/ph-4.png',
      alt: 'Drinks at a small gathering',
    },
  ],
};

export const packages = {
  head: {
    kicker: 'Packages',
    title: 'Three ways to pour.',
    lead: "Every booking is one bartender, tailored to your numbers and hours — these are the starting points. Tell us the date and we'll send an exact quote.",
  } satisfies SectionHeadContent,
  tiers: [
    {
      name: 'The Pour',
      desc: 'The essentials, done properly.',
      fromPrice: 150,
      items: [
        'One bartender, up to 3 hours',
        'Two house signature cocktails',
        'Beer, wine & soft drinks too',
        'Bar, glassware & ice included',
        'Soft & alcohol-free options',
        'Up to 25 guests',
      ],
    },
    {
      name: 'The Spread',
      desc: 'Our full bar experience.',
      fromPrice: 700,
      featured: true,
      badge: 'Most booked',
      items: [
        'One bartender, up to 5 hours',
        'Short cocktail menu, four serves',
        'Beer, wine & soft drinks too',
        'Garnish program & premium glassware',
        'Arrival drink on the door',
        'Up to 45 guests',
      ],
    },
    {
      name: 'The Whole Night',
      desc: 'Bespoke, top to bottom.',
      fromPrice: 950,
      items: [
        'One bartender, hours to suit',
        'Bespoke menu & tasting session',
        'Premium & rare spirits',
        'Themed or personalised serves',
        'Up to 60 guests',
      ],
    },
  ] satisfies Package[],
  note: 'Prices are indicative starting points · final quote depends on guest numbers, hours & travel.',
};

export const gallery = {
  head: {
    kicker: 'Gallery',
    title: 'Last call, every time.',
    lead: 'A few favourites from recent pours.',
  } satisfies SectionHeadContent,
  images: [
    // { image: '/images/ph-3.png', alt: 'Signature cocktail close-up', size: 'feature' },
    // { image: '/images/ph-5.png', alt: 'Garnish preparation', size: 'normal' },
    // { image: '/images/ph-6.png', alt: 'The bar setup', size: 'normal' },
    // { image: '/images/ph-7.png', alt: 'Guests at the bar', size: 'wide' },
    // { image: '/images/ph-1.png', alt: 'Evening pours', size: 'normal' },
    // { image: '/images/ph-2.png', alt: 'A toast', size: 'normal' },
    // { image: '/images/ph-4.png', alt: 'Last drinks of the night', size: 'wide' },
  ] as { image: string; alt: string; size: 'feature' | 'wide' | 'normal' }[],
};

export const about = {
  kicker: 'Our story',
  heading: 'We named it after the first sip.',
  // **bold** spans render as <strong>
  paragraphs: [
    'Proof of Life started with a simple belief: a good drink, made properly and handed over with a bit of warmth, changes the whole feel of a room.',
    "We're a **mobile cocktail company** — spirits, kit and a seasoned bartender that travel to wherever the night's happening. No corporate gloss, no clipboard energy. Just a genuinely good bar, parked in your venue for the evening.",
    'We keep it deliberately small. One bar, one bartender, full attention on your guests — and a setup that leaves your space exactly as we found it.',
  ],
  signature: '— The Proof of Life team',
  image: { src: '/images/ph-about.png', alt: 'The Proof of Life team' },
};

export const testimonials = {
  head: {
    kicker: 'Kind words',
    title: 'The morning-after reviews.',
  } satisfies SectionHeadContent,
  quotes: [
    {
      quote: 'Our guests are still asking who did the bar. Faultless from setup to last pour.',
      who: 'Wedding · Cotswolds',
    },
    {
      quote: 'Turned a back garden into the best night of the summer. Worth every penny.',
      who: '40th birthday · London',
    },
    {
      quote: "Professional, warm, and the cocktails were genuinely excellent. We'll book again.",
      who: 'Anniversary · Bristol',
    },
  ],
};

export const faqs = {
  head: {
    kicker: 'Good to know',
    title: 'Questions, answered.',
  } satisfies SectionHeadContent,
  items: [
    {
      q: 'Do you provide the alcohol?',
      a: "Yes — spirits, mixers, garnish and ice come as standard. Prefer to supply your own? We're happy to work on a dry-hire basis, where you provide the stock and we bring the bar, kit and bartender.",
    },
    {
      q: 'How much space do you need?',
      a: "A footprint of roughly 2m × 1.5m and reasonably level access is plenty for the bar. We'll talk through your venue beforehand so setup is effortless on the day.",
    },
    {
      q: 'How far do you travel?',
      a: "We're a mobile bar, so travel is the point. Local events are covered as standard; anything further afield is easily arranged with a small travel charge folded into your quote.",
    },
    {
      q: 'Are you licensed and insured?',
      a: "Yes — we carry public liability insurance and hold a personal licence. If your venue needs a Temporary Event Notice, we'll guide you through it.",
    },
    {
      q: 'How many guests can one bar handle?',
      a: "We're built for intimate events — up to around 60 guests with a single bartender. That's where one bar shines: everyone gets a proper drink and a bit of attention, with no queue swallowing the evening.",
    },
    {
      q: 'Is it only cocktails?',
      a: "Cocktails are what we do best, but they're far from the whole bar. Every booking comes with chilled beer, wine and soft drinks as standard, plus thoughtful alcohol-free serves — so there's something for everyone, whatever they're in the mood for.",
    },
    {
      q: 'Can you make a non-alcoholic menu?',
      a: "Always. Every package includes thoughtful alcohol-free serves, and we're glad to build a full zero-proof menu that's every bit as good as the rest.",
    },
  ],
};

export const contact = {
  kicker: 'Book the bar',
  headingTail: 'a good night',
  lead: "Tell us the date, the place and roughly how many. We'll come back with a tailored quote — usually the same day.",
  caption: 'Message to book · WhatsApp',
};

export const footer = {
  links: [
    { label: 'What we do', href: '#what' },
    { label: 'Packages', href: '#packages' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
  ],
};
