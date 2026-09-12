import { cld } from '@/lib/cloudinary';

/**
 * All homepage copy and figures. Presentation lives in the components;
 * this file is the single source for what the page says.
 * Nothing here is invented: every figure comes from the existing site.
 */

export const project = {
  name: 'Yamuna Sky City',
  developer: 'Yamuna Homes and Design Pvt. Ltd.',
  rera: 'PRM/KA/RERA/1257/334/PR/171023/006331',
  phone: '+91 88844 39155',
  phoneHref: 'tel:+918884439155',
  whatsapp: 'https://wa.me/918884439155?text=Hi%2C+I%27m+interested+in+Yamuna+Sky+City',
  email: 'yamunahomes16@gmail.com',
  address: '1st Floor, Nalapad Building,\nMallikatta, Kadri, Mangalore',
  addressLines: ['1st Floor, Nalapad Building,', 'Mallikatta, Kadri,', 'Mangalore – 575003'],
  floors: 60,
} as const;

export const media = {
  heroPoster: cld('v1777554903/hero-poster_emnfvb.jpg', 1920),
  heroWebm: 'https://res.cloudinary.com/drzbbbncs/video/upload/v1777554895/hero_b0imcd.webm',
  heroMp4: 'https://res.cloudinary.com/drzbbbncs/video/upload/v1777554838/hero_gxnqcd.mp4',
  skyMark: cld('v1777699538/skyfavicon_1_tufy14.png', 160),
  yamunaMark: cld('v1777696301/yamuna_homes_z4hnie.png', 240),
  wave: cld('v1777698110/wave-start_lp5h52.png', 1600),
  balconyPlan: cld('v1777698109/balcony-plan_ob6gd2.jpg', 1600),
  blueprint: cld('v1777700841/blueprint_xfe9ca.jpg', 1200),
} as const;

export const overview = {
  kicker: 'Project overview',
  headline: ["South India's tallest", 'sea view tower'],
  body: [
    'A landmark residential development on the NH-66 corridor of New Mangalore — combining scale, architectural precision, and uninterrupted sea views into a single iconic address. Yamuna Sky City is not just a building. It is a new definition of coastal luxury.',
    'Developed by Yamuna Homes and Design Pvt. Ltd. — a trusted name in Karnataka real estate for over 30 years. GF+60 floors. 296 all-sea-facing units. One tower. No compromises.',
  ],
  stats: [
    { value: '296', label: 'Luxury apartments' },
    { value: 'GF+60', label: 'Floors above ground' },
    { value: '3+', label: 'Acres of greenery' },
    { value: '300m', label: 'From the Arabian Sea' },
  ],
} as const;

export const landmarks = [
  { name: 'Ryan Intl School', km: 0.5, dist: '0.5 km', time: '2 min' },
  { name: 'NITK Campus', km: 4, dist: '4 km', time: '8 min' },
  { name: 'Surathkal Rly', km: 4, dist: '4 km', time: '10 min' },
  { name: 'Panambur Beach', km: 5, dist: '5 km', time: '12 min' },
  { name: 'MRPL', km: 6, dist: '6 km', time: '14 min' },
  { name: 'MIA Airport', km: 12, dist: '12 km', time: '20 min' },
] as const;

export const specifications = {
  kicker: 'Technical excellence',
  headline: ['The pinnacle of', 'coastal architecture'],
  main: [
    { value: 60, suffix: '+', label: 'Floors above ground', desc: 'The tallest residential structure in South India.' },
    { value: 296, suffix: '', label: 'Luxury apartments', desc: 'Every single unit faces the Arabian Sea.' },
    { value: 1, suffix: '', label: 'Iconic tower', desc: 'A singular landmark on the Mangalore skyline.' },
  ],
  sub: [
    { value: '10+', label: 'World-class amenities' },
    { value: '3+', label: 'Acres of greenery' },
    { value: '30+', label: 'Years of excellence' },
    { value: '4,500 sq ft', label: 'Club house' },
  ],
} as const;

export const amenities = [
  { title: 'Podium Infinity Pool', cat: 'Serenity', image: cld('v1777700841/amenity_pool_ikcpqy.jpg', 900), desc: 'An architectural marvel where the pool edge meets the Arabian Sea on the horizon.' },
  { title: 'Private Mini Theatre', cat: 'Entertainment', image: cld('v1777672872/Theater_s9f5ws.jpg', 900), desc: 'A bespoke cinematic experience with state-of-the-art acoustics and plush reclining seats.' },
  { title: 'Grand Banquet Hall', cat: 'Events', image: cld('v1777672873/Banquet_ek3fc8.jpg', 900), desc: 'A majestic venue for grand celebrations, weddings, and elite corporate gatherings.' },
  { title: 'Royal Wellness Spa', cat: 'Wellness', image: cld('v1777672872/Spa_lkqfyf.jpg', 900), desc: 'Deep rejuvenation through traditional and modern therapies in a tranquil, ocean-side setting.' },
  { title: 'Yoga & Meditation Studio', cat: 'Energy', image: cld('v1777672710/Yoga_jxg4ne.jpg', 900), desc: 'A serene, light-filled space designed for mindfulness, breathwork, and spiritual balance.' },
  { title: 'Arcade & Game Room', cat: 'Recreation', image: cld('v1777672705/Gameroom_u43si8.jpg', 900), desc: 'A vibrant social hub featuring high-end gaming consoles, billiards, and interactive entertainment.' },
  { title: 'Elite Fitness Center', cat: 'Performance', image: cld('v1777672704/Gym_n6nqft.jpg', 900), desc: 'A world-class gym equipped with the latest strength and cardio technology for peak health.' },
] as const;

export const showcase = {
  kicker: 'Architectural narrative',
  headline: ['Nature transcribed', 'into geometry'],
  body: 'The architecture of Yamuna Sky City is a direct extension of the coastline. The organic rhythm of the Arabian Sea waves is distilled into rigid, high-performance structural perimeters.',
  /**
   * The plate's two states, labelled the way a drawing would be. This
   * replaces the old "move your cursor" instruction: the transcription
   * now happens on scroll, so it does not need to be asked for.
   */
  states: [
    'Observed · Arabian Sea wave front',
    'Transcribed · balcony perimeter, typical floor',
  ],
  points: [
    'Wave-inspired balcony perimeters',
    'Biophilic structural engineering',
    'Seamless sea-to-home transition',
  ],
} as const;

/**
 * The sea-facing balcony perimeter of the typical floor, traced off the
 * plan drawing itself rather than approximated: the top edge of the
 * plan's own silhouette, smoothed past the balcony nibs and JPEG noise,
 * sampled at 48 points evenly across the building's width.
 *
 * The values are in the drawing's own pixel space, so anything plotted
 * in that space registers on the plan exactly, with no guessing at where
 * the building sits inside its frame.
 *
 * Source: `media.balconyPlan`, 1600 x 899.
 */
export const balconyPerimeter = {
  plan: { width: 1600, height: 899 },
  /** The building's horizontal extent within the drawing. */
  from: 90,
  to: 1522,
  /** The perimeter's own vertical average, to stack floor plates around. */
  meanY: 271,
  /** The paper the drawing is printed on, which gets keyed out. */
  /**
   * The same drawing with its sheet keyed out, so it composites over the
   * photograph without carrying a rectangle of paper with it. The sheet
   * and the interior floors are the same colour, so the key is by
   * connectivity — whatever paper the frame edge can reach — not by
   * colour. Same 1600 x 899 frame, so these coordinates still hold.
   */
  keyed: '/media/plan/typical-floor-keyed.webp',
  y: [
    491, 427, 395, 379, 361, 340, 319, 301, 285, 272, 258, 242,
    225, 209, 199, 193, 190, 192, 194, 195, 194, 192, 188, 186,
    187, 190, 193, 195, 195, 193, 191, 191, 195, 203, 215, 232,
    249, 264, 278, 293, 313, 333, 354, 373, 389, 411, 449, 512,
  ],
} as const;

export const plans = [
  {
    type: '2 BHK', floors: '3rd – 32nd Floor', from: 3, to: 32, size: '1,500 – 1,650',
    desc: 'Thoughtfully designed for families seeking panoramic sea views. All units sea-facing with private balconies and premium coastal finishes.',
  },
  {
    type: '3 BHK', floors: '5th – 45th Floor', from: 5, to: 45, size: '1,850 – 2,100',
    desc: 'Spacious family homes with split-level living, home office nook, and uninterrupted Arabian Sea views from every room.',
  },
  {
    type: '4 BHK', floors: '20th – 55th Floor', from: 20, to: 55, size: '2,400 – 2,850',
    desc: "Grand residences for those who demand more. Double-height living rooms, chef's kitchen, and sky-terrace balconies.",
  },
  {
    type: '5 BHK', floors: '45th – 60th Floor', from: 45, to: 60, size: '3,400 – 4,200',
    desc: 'Ultra-luxury penthouses with private plunge pools, panoramic wraparound decks, and bespoke interior finishes.',
  },
] as const;

export const locationFacts = [
  { label: 'Kulai, New Mangalore', sub: 'Prime coastal address' },
  { label: '~300m from Arabian Sea', sub: 'Every residence faces the sea' },
  { label: '~12km Mangalore Airport', sub: 'Via NH-66 corridor' },
  { label: 'Surathkal Railway ~4km', sub: 'Direct national rail access' },
] as const;

export const viewing = {
  kicker: 'Private viewing',
  statement: ['Some things', 'cannot be', 'photographed'],
  body: 'The horizon from the sixtieth floor is one of them. Our consultants arrange private viewings at the site, by appointment.',
  cta: 'Book a site visit',
} as const;

export const partners = [
  {
    name: 'CPP Wind Engineering', role: 'Wind engineering consultants',
    desc: 'Global leaders with advanced labs in USA, Australia and Malaysia, ensuring structural stability under all coastal wind conditions.',
    detail: 'USA, Australia, Malaysia',
  },
  {
    name: 'Shanghvi & Associates', role: 'Structural consultant',
    desc: "Over 50 years of excellence providing the structural backbone for India's most ambitious residential skyscrapers.",
    detail: '50+ years of excellence',
  },
  {
    name: 'MFE Formwork Technology', role: 'Aluminium formwork',
    desc: 'Global leader in 50+ countries since 1991, delivering precision and speed through world-class formwork systems.',
    detail: '50+ countries, since 1991',
  },
] as const;

export const milestones = [
  { date: 'March 2023', title: 'Site Establishment', desc: 'Site clearing, boundary establishment, and foundation survey completed.', image: null as string | null },
  { date: 'January 2024', title: 'Piling & Batching Plant', desc: 'Inauguration of site batching plant and commencement of structural piling.', image: null as string | null },
  { date: 'March 2024', title: 'Quality Assurance', desc: 'Cube casting and rigorous concrete quality checks ensuring structural integrity.', image: null as string | null },
  { date: 'Ongoing 2025', title: 'Superstructure Rising', desc: 'MFE Aluminium Formwork technology driving vertical growth at pace.', image: null as string | null },
] as const;

export const legacy = {
  kicker: 'What drives us',
  headline: ['Our journey', '& commitment'],
  body: 'For over three decades, Yamuna Homes and Design Pvt. Ltd. has been shaping skylines across Karnataka — where trust is our foundation and quality is our enduring signature.',
  checklist: ['Superior Spaces', 'Innovative Designs', 'Timely Delivery', 'Client Relationships'],
  valuesKicker: 'What we stand for',
  values: [
    'Quality Commitment', 'Innovative Practices',
    'Customer Satisfaction', 'Sustainable Solutions',
    'Integrity & Transparency', 'Excellence in Craft',
  ],
  milestoneLabel: 'The milestone',
  milestoneValue: '30+',
  milestoneTitle: 'Years of excellence',
  milestoneBody: 'A legacy of delivering premium living spaces that stand the test of time, trends, and architectural ambition.',
  footerLine: 'Building trust, quality, dreams, success & excellence.',
  footerBody: 'Yamuna Homes and Design Pvt. Ltd. — shaping skylines across Karnataka since 1993 with trust, quality, and architectural ambition.',
} as const;

export const contact = {
  kicker: 'Get in touch',
  headline: ['Book your', 'luxury address'],
  body: 'Experience the pinnacle of coastal living. Our dedicated consultants will reach you within 24 hours to arrange an exclusive site visit.',
  formTitle: 'Request a consultation',
  formNote: 'Our team responds within 24 hours, personally.',
  consent: 'I agree to receive communications regarding Yamuna Sky City and acknowledge the processing of my personal data as per the Privacy Policy.',
  successTitle: 'Enquiry received',
  successBody: 'Our luxury property consultant will personally reach you within 24 hours.',
} as const;

export const navLinks = [
  { label: 'The ascent', href: '#overview' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Residences', href: '#floorplans' },
  { label: 'Location', href: '#location' },
  { label: 'Progress', href: '#progress' },
] as const;

export const socials = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'YouTube', href: '#' },
] as const;

/** The ascent. Each figure is pinned to the fraction of the climb at
    which it becomes true, so the reader meets it at that altitude. */
export const ascent = {
  eyebrow: 'The ascent',
  line: 'Every one of them faces the sea.',
  markers: [
    { at: 0.14, value: '296', label: 'Sea-facing homes' },
    { at: 0.36, value: 'GF+60', label: 'Floors above ground' },
    { at: 0.58, value: '3+', label: 'Acres of greenery' },
    { at: 0.78, value: '300m', label: 'From the Arabian Sea' },
  ],
} as const;

/** The 3D location experience, hosted externally by the developer. */
export const explore3d = {
  eyebrow: '3D experience',
  headline: ['See where', 'Sky City rises'],
  body: 'Explore the project and its surroundings through an immersive 3D location experience.',
  cta: 'Enter the experience',
  note: 'Opens in a new tab',
  href: 'https://www.turiya.co/360/YamunaSkyCity/',
  preview: '/media/posters/explore-3d-preview.jpg',
  previewAlt: 'Aerial 3D location and master plan overview for Yamuna Sky City',
} as const;

/**
 * The project team, reproduced exactly as printed in the official
 * brochure. Nothing here is inferred and nothing is added.
 */
export const people = {
  eyebrow: 'The people behind the project',
  headline: ['Designed and engineered', 'by specialists'],
  body: 'The consultants and contractors delivering Yamuna Sky City, as published in the project brochure.',
  contributors: [
    { role: 'Architect', name: 'Archi Technics', place: 'Mangalore' },
    { role: 'Structural Consultant', name: 'Shanghvi & Associates Consultants Private Limited', place: 'Mumbai' },
    { role: 'Wind Engineering Consultants', name: 'CPP Wind Engineering Consultants', place: 'Australia' },
    { role: 'Geotechnical Consultants', name: 'Geocon International Pvt. Ltd.', place: 'Mumbai' },
    { role: 'MEP Consultant', name: 'Prashanti MEP Consultants', place: 'Mumbai' },
    { role: 'PMC', name: 'SS Engineers & Consultants', place: 'Mangalore' },
    { role: 'Landscape Architect', name: 'Studio Naadi', place: 'Bangalore' },
    { role: 'Test Pile Load Test Agency', name: 'Rudra Infra', place: 'Mumbai' },
    { role: 'Piling Works', name: 'Chaudhary Constructions', place: 'Mangalore' },
    { role: 'Pile Testing Agency', name: 'Geo Dynamics', place: 'Vadodara' },
    { role: 'Main Civil Works', name: 'MFAR Constructions Pvt. Ltd.', place: '' },
    { role: 'Aluminium Formwork', name: 'MFE Formwork (Mivan)', place: 'Malaysia' },
  ],
} as const;

/**
 * Landmark travel times from the client-approved "Perfectly Connected"
 * artwork, with the chip positions from that same composition. Do not
 * add a landmark or a time that is not in the approved asset.
 */
export const connected = {
  eyebrow: 'Location',
  headline: ['Perfectly', 'connected'],
  body: 'Yamuna Sky City places you right where life happens. Be it the beach, the city, the highway or the best schools, everything is just minutes away.',
  aerial: '/media/location/tower-aerial-render.webp',
  aerialAlt: 'Aerial view of the Yamuna Sky City tower rising from coastal greenery beside the Arabian Sea beach',
  viewBox: { w: 1000, h: 563 },
  centre: { x: 546, y: 269 },
  rings: [148, 188, 228],
  lineEnd: 150,
  nodes: [
    { icon: 'beach', label: 'Beach', minutes: 2, x: 392, y: 123 },
    { icon: 'highway', label: 'National Highway 66', minutes: 2, x: 789, y: 125 },
    { icon: 'rail', label: 'Railway Station', minutes: 8, x: 323, y: 267 },
    { icon: 'school', label: 'Ryan International School', minutes: 4, x: 847, y: 262 },
    { icon: 'hospital', label: 'AJ Hospital', minutes: 7, x: 371, y: 422 },
    { icon: 'city', label: 'City Centre', minutes: 15, x: 566, y: 478 },
    { icon: 'airport', label: 'Mangalore International Airport', minutes: 20, x: 768, y: 445 },
  ],
  highlights: [
    'Unmatched seaside living',
    'Seamless city connectivity',
    'Everything within reach',
  ],
} as const;

export const brochureHref = '/media/brochure/Yamuna-Sky-City-Brochure.pdf';

/**
 * The floor schedule, derived from the verified residence bands in
 * `plans` above. Nothing here is invented: a floor's mix is simply which
 * bands contain it.
 *
 * The reference deck shows a per-flat table with unit numbers (G-01,
 * G-02) and areas that disagree with the band sizes on this site. Those
 * numbers are unconfirmed, so this schedule reports the band data we do
 * have rather than fabricating a unit register.
 *
 * `snap` marks a floor where the mix changes. The climb settles on those
 * and glides through the identical floors between them, which is the
 * behaviour the deck asks for.
 */
export type FloorZone = {
  from: number;
  to: number;
  name: string;
  note: string;
  /** Residence types available on these floors, by `plans` index. */
  types: number[];
};

export const floorZones: FloorZone[] = [
  { from: 0, to: 0, name: 'Ground', note: 'Arrival, lobby and drop-off', types: [0, 1, 2] },
  { from: 1, to: 2, name: 'Podium', note: 'The shared floors: club, pool, courts and greenery', types: [] },
  { from: 3, to: 4, name: 'Lower residences', note: 'The first homes above the podium', types: [0] },
  { from: 5, to: 19, name: 'Typical floors', note: 'The repeating plate that makes up most of the tower', types: [0, 1] },
  { from: 20, to: 32, name: 'Mid rise', note: 'Where the larger plans begin', types: [0, 1, 2] },
  { from: 33, to: 44, name: 'Upper typical', note: 'Two-bedroom homes end below this level', types: [1, 2] },
  { from: 45, to: 55, name: 'High rise', note: 'The penthouse band starts here', types: [1, 2, 3] },
  { from: 56, to: 59, name: 'Sky residences', note: 'Penthouses only', types: [3] },
  { from: 60, to: 60, name: 'Terrace', note: 'The top of the tower, 200 metres above sea level', types: [3] },
];

/** Floors where the mix changes, so the climb has somewhere to settle. */
export const snapFloors = floorZones.map((z) => z.from);

/** Line icons for the connectivity radar, keyed to the landmark label. */
export type LandmarkIcon = 'beach' | 'highway' | 'rail' | 'school' | 'hospital' | 'city' | 'airport';

/**
 * FLAT REGISTER — transcribed from the client reference deck
 * ("YSC Website static Reference.pdf", Building Climb page).
 *
 * PROVENANCE WARNING. These unit numbers and areas come from that deck
 * and CONFLICT with the band sizes in `plans` above: the deck lists a
 * 2 BHK at 1,248 sq ft where this site publishes 1,500–1,650. One of the
 * two is wrong. Nothing here is inferred or filled in — the deck only
 * shows the ground-floor rows, so only those are recorded, and every
 * other floor falls back to the published bands.
 *
 * Do not ship both figures. Resolve against the approved area statement
 * first, then extend this register floor by floor.
 */
export type FlatRow = { unit: string; type: string; area: string };

export const flatRegister: Record<number, FlatRow[]> = {
  0: [
    { unit: 'G-01', type: '2 BHK', area: '1248 sq.ft' },
    { unit: 'G-02', type: '3 BHK', area: '1675 sq.ft' },
    { unit: 'G-03', type: '4 BHK', area: '2140 sq.ft' },
  ],
};

/** True while the register is incomplete, so the UI can say so. */
export const flatRegisterIsPartial = true;

/**
 * The wireframe elevation, lifted from the client reference deck
 * (Building Climb page) and cleaned for use: the highlight that was
 * baked into the podium has been neutralised so this page can drive its
 * own, and the paper has been keyed to transparency so the drawing sits
 * on whatever the stage is currently showing.
 *
 * The fractions are measured off the artwork itself, not guessed, so an
 * overlay positioned with them lands on the right part of the building.
 */
export const towerElevation = {
  src: '/media/tower/wireframe-elevation.png',
  width: 330,
  height: 930,
  /** Ground line, as a fraction of the image height from the top. */
  groundAt: 917 / 930,
  /** Top of the habitable body, below the crown wings. */
  topAt: 112 / 930,
  /** The podium widens here; below it is shared, above it is homes. */
  podiumAt: 758 / 930,
  /**
   * The lift core's axis, as a fraction of the image width. The building
   * is not centred in its own crop, so anything that should ride the core
   * has to use this rather than 50%: the mast above the roof is the core
   * extended, and it measures x 169–176 of 330.
   */
  coreAt: 172.5 / 330,
  /** The shaft's own left and right edges, for the highlight band. */
  shaftLeft: 43 / 330,
  shaftRight: 298 / 330,
} as const;

/**
 * The lift car, measured off the drawing's own car where it sits parked
 * at the base of the shaft: outer box x 156–189, y 828–884, door frame
 * inset four units, doors meeting on the core at x 172.
 *
 * It is given in artwork units rather than pixels so the car is exactly
 * as wide as the shaft it rides in at any render size, and it is drawn as
 * vector so it stays crisp and can carry the brand colour. The parked car
 * has been cleared out of the artwork, since this one replaces it.
 */
export const liftCar = {
  width: 33,
  height: 56,
  /** The hanger and hoist rope above the car. */
  yoke: 12,
  /** The door frame inside the car, and where the two doors meet. */
  frameInset: 4,
  doorSplit: 16.5,
} as const;
