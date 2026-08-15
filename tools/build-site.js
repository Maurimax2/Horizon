#!/usr/bin/env node
/**
 * Générateur du site — coquille commune + données réelles.
 * Toutes les pages sortent d'ici pour que l'en-tête, le pied de page et les
 * fiches restent cohérents. Contenu factuel : voir source/site-content.md.
 *
 *   node tools/build-site.js
 */
const fs = require('fs');
const path = require('path');
const R = path.join(__dirname, '..');

/* ═══════════════════════════════════════════════════════ DONNÉES ═════ */

const PHONE = '+222 46 65 65 94';
const WA = '22246656594';
const MAIL = 'contact@mauritaniahorizons.com';

const JOURNEYS = [
  {
    slug: 'ultimate-mauritania-expedition',
    n: '01', days: 12, price: null, min: 3,
    title: 'Ultimate Mauritania Expedition',
    strap: 'Desert, ancient cities & Atlantic coast',
    line: 'Adrar · Ancient cities · Atlantic coast',
    img: 'ouadane-arches-pierre',
    hero: 'ouadane-arches-pierre',
    blurb: 'The full crossing. Starts in the Adrar and takes in Chinguetti and Ouadane with their ancient libraries, the Richat Structure, the Ben Amira monolith and Banc d\'Arguin.',
    love: [
      ['The Eye of the Sahara', 'Forty kilometres of concentric rock, reached by 4×4 and camped on the ridges.'],
      ['Two UNESCO cities', 'Chinguetti and Ouadane — manuscripts kept by the same families for centuries.'],
      ['Ocean at the end', 'The expedition finishes on the Atlantic, at Banc d\'Arguin.'],
    ],
    gallery: ['ouadane-tour-pierre', 'richat-vue-aerienne', 'manuscrits-anciens', 'chinguetti-ruelle'],
  },
  {
    slug: 'sahara-iron-ore-train',
    n: '02', days: 6, price: null, min: 3,
    title: 'Sahara Adventure & Iron Ore Train',
    strap: "L'Épopée Saharienne : Adrar & Train du Désert",
    line: 'Terjit · Chinguetti · Ouadane · Choum · Nouadhibou',
    img: 'train-fer-coucher-soleil',
    hero: 'train-fer-nuit-campement',
    blurb: 'Six days between dunes, ancient cities and legendary rails. Board at Choum and ride the ore through the night to the Atlantic.',
    love: [
      ['A night on the ore train', 'One of the longest trains on earth, crossing the Sahara in the dark.'],
      ['Terjit', 'A geological fault hiding a palm grove and freshwater springs.'],
      ['Chinguetti libraries', 'Medieval manuscripts, unlocked and handed to you.'],
    ],
    gallery: ['train-fer-portrait-masque', 'train-fer-wagon-minerai', 'terjit-oasis', 'ouadane-vieille-ville'],
    itinerary: [
      { d: '01', t: 'Nouakchott → Azouega', h: 'Départ vers les terres de l\'Adrar',
        p: 'North out of Nouakchott, through the old mining town of Akjoujt, and into the Adrar.',
        s: 'Night: camp or auberge in Azouega', img: 'vehicule-interieur-village' },
      { d: '02', t: 'Azouega → Chinguetti', h: 'Sources sacrées et manuscrits anciens',
        p: 'Breakfast in the oasis, then Terjit — a fault in the rock holding a palm grove, cliffs and freshwater springs. Chinguetti in the afternoon: the libraries, the medieval manuscripts, the old town.',
        s: 'Night: traditional auberge in Chinguetti', img: 'terjit-oasis' },
      { d: '03', t: 'Chinguetti → Atar', h: 'Sur les traces des caravanes',
        p: 'The dunes around Chinguetti in the morning, then Ouadane — UNESCO-listed, its upper city in ruins. On to Atar, the region\'s trading crossroads.',
        s: 'Night: hotel or guesthouse in Atar', img: 'ouadane-vieille-ville' },
      { d: '04', t: 'The Iron Ore Train', h: 'La traversée du désert sur les rails',
        p: 'Choum tunnel, then Tmeimichatt, where you board. The world\'s longest train, a night crossing of the Sahara, and a sky with nothing under it.',
        s: 'Night: on the train — bivouac on rails', img: 'train-fer-portrait-masque' },
      { d: '05', t: 'Nouadhibou', h: 'L\'Océan après le sable',
        p: 'Arrival in the morning on the peninsula. Rest, then Cap Blanc and the artisanal fishing ports — a city held between the desert and the Atlantic.',
        s: 'Night: hotel in Nouadhibou', img: 'equipe-tshirt-pirogue' },
      { d: '06', t: 'Nouadhibou → Nouakchott', h: 'La Route de l\'Atlantique',
        p: 'The coastal road south, the wild edges of Banc d\'Arguin in the distance, and a last stop at the fishing port of Nouakchott.',
        s: 'End of the expedition', img: 'marche-artisanat' },
    ],
  },
  {
    slug: 'desert-ocean-escape',
    n: '03', days: 10, price: 149, min: 3,
    title: 'Mauritania Desert & Ocean Escape',
    strap: 'From the capital to the Banc d\'Arguin',
    line: 'Nouakchott · Banc d\'Arguin · Dunes · Oases',
    img: 'terjit-oasis', hero: 'terjit-palmeraie',
    blurb: 'Explore the beauty of Mauritania, from the vibrant city of Nouakchott to the serene Banc d\'Arguin, vast dunes, historic towns and stunning oases.',
    love: [
      ['Banc d\'Arguin', 'One of the world\'s great bird coasts, sailed with Imraguen fishermen.'],
      ['Oases', 'Freshwater springs under palms, in the middle of the driest country in the region.'],
      ['Both worlds', 'Ocean and erg in a single journey.'],
    ],
    gallery: ['terjit-oasis', 'vehicule-interieur-village', 'marche-artisanat', 'chinguetti-ruelle'],
  },
  {
    slug: 'sands-stars-adventure',
    n: '04', days: 10, price: 200, min: 3,
    title: 'Sands & Stars Adventure',
    strap: 'Bedouin culture, birdlife and bivouacs',
    line: 'Bedouin culture · Birdwatching · Ancient cities · Bivouacs',
    img: 'campement-feu-nuit', hero: 'danse-feu-nuit',
    blurb: 'A ten-day journey through Mauritania\'s breathtaking landscapes — Bedouin culture, birdwatching, ancient cities and desert bivouacs under the stars.',
    love: [
      ['No light pollution', 'The nearest street light is two hundred kilometres away.'],
      ['Bedouin hospitality', 'Tea that takes three hours, on their terms.'],
      ['Birdlife', 'Migratory species along the coast and the inland wetlands.'],
    ],
    gallery: ['campement-feu-nuit', 'danse-feu-nuit', 'portrait-cheche-noir', 'bivouac-placeholder'],
  },
  {
    slug: 'coast-to-desert',
    n: '05', days: 9, price: 300, min: 3,
    title: 'Mauritania Explorer: From Coast to Desert',
    strap: 'Fishing villages to the dunes of Amatlić',
    line: 'Banc d\'Arguin · Amatlić · Terget · Chinguetti',
    img: 'chinguetti-ruelle', hero: 'chinguetti-ruelle',
    blurb: 'Discover the hidden gems of Mauritania, from the fishing villages of Banc d\'Arguin to the dunes of Amatlić, the oasis of Terget and UNESCO-listed Chinguetti.',
    love: [
      ['Imraguen villages', 'Fishing communities who still sail lanches under canvas.'],
      ['Amatlić dunes', 'Long, clean ridges of sand between the coast and the Adrar.'],
      ['Chinguetti', 'The seventh city of Islam, and its libraries.'],
    ],
    gallery: ['chinguetti-ruelle', 'ouadane-ruines-panneau', 'terjit-palmeraie', 'portrait-boubou-bleu'],
  },
  {
    slug: 'nouakchott-tour',
    n: '06', days: 1, price: null, min: 2,
    title: 'Nouakchott Tour',
    strap: 'One day in the capital',
    line: 'Fishing port · Markets · Mosque · Dunes at sunset',
    img: 'marche-artisanat', hero: 'marche-artisanat',
    blurb: 'The fishing port and the returning pirogues, the National Museum, the central market, méchoui and thieboudienne, the Ibn Abbas mosque, then camels and sunset on the dunes.',
    love: [
      ['The fishing port', 'Hundreds of painted pirogues coming in at once.'],
      ['A real lunch', 'Méchoui, thieboudienne, mafé — in a traditional restaurant, not a hotel.'],
      ['Sunset on the dunes', 'Camels at the edge of the city, then dinner.'],
    ],
    gallery: ['marche-artisanat', 'equipe-tshirt-pirogue', 'portrait-boubou-bleu', 'vehicule-interieur-village'],
    itinerary: [
      { d: '01', t: 'Fishing port & beach', h: 'The pirogues come in',
        p: 'The fishing port and the return of the colourful pirogues, then a walk along the beach.',
        s: 'Morning', img: 'equipe-tshirt-pirogue' },
      { d: '02', t: 'Culture & local life', h: 'Museum and central market',
        p: 'The National Museum and the central market — the capital as it actually works.',
        s: 'Late morning', img: 'marche-artisanat' },
      { d: '03', t: 'Mauritanian food', h: 'Méchoui, thieboudienne, mafé',
        p: 'Lunch in a traditional restaurant.', s: 'Midday', img: 'vehicule-interieur-village' },
      { d: '04', t: 'Spirituality & dunes', h: 'Ibn Abbas mosque, artisans, camels',
        p: 'The Ibn Abbas mosque and the artisans\' market, then out to the dunes for a camel ride.',
        s: 'Afternoon', img: 'vehicule-interieur-village' },
      { d: '05', t: 'Sunset & dinner', h: 'The day closes on the sand',
        p: 'Sunset over the dunes, then a traditional dinner.', s: 'Evening', img: 'campement-feu-nuit' },
    ],
  },
];

const INCLUDED = [
  ['Accommodation', 'Standard secure hotels and camps.'],
  ['Guides', 'A Mauritania Horizons expedition leader, a local expert guide and a French/English-speaking driver.'],
  ['Transport', 'All transport required by the itinerary, in air-conditioned 4×4s.'],
  ['Meals', 'All meals and water outside Nouakchott and Nouadhibou.'],
  ['Activities', 'Everything listed in the itinerary unless stated otherwise.'],
  ['Taxes & fees', 'VAT and entrance fees for tourist sites.'],
];

const EXCLUDED = [
  ['Flights', 'Return flights to Nouakchott.'],
  ['Visa', '$55 USD, paid on arrival. We assist with the file.'],
  ['Insurance', 'Travel insurance is mandatory for the circuit.'],
  ['Tips', 'For the local guide and the driver.'],
  ['Some meals', 'Lunch and dinner in Nouakchott and Nouadhibou.'],
  ['Train kit', 'Snacks, blanket, sleeping bag, sunglasses, chèche and dust mask for the ore train.'],
];

const FAQ = [
  ['Is Mauritania safe?', 'We run our own vehicles and our own crews, our guides are from the regions we cross, and logistical assistance is available 24/7 for the whole of your stay. Travel insurance is mandatory on every circuit.'],
  ['Do I need a visa?', 'Yes. A biometric visa can be issued on arrival at Nouakchott international airport and at land borders — $55 USD, paid on the spot. We handle the file with you and meet you at the airport.'],
  ['When should I come?', 'October to March. Days are warm rather than punishing, and the nights in the deep desert are genuinely cold.'],
  ['What should I pack?', 'Long, covering clothing, walking shoes and high-factor sun protection. For the iron ore train, add a chèche, goggles or sunglasses, a dust mask and a warm sleeping bag — and clothes you accept will keep the ore dust.'],
  ['Can I travel solo?', 'Most journeys run from three travellers. Tell us your dates and we will tell you honestly whether a departure is forming, or quote you a private one.'],
  ['Can you change the itinerary?', 'Yes. Every itinerary here is a starting point. Couples, families, photographers, film crews and researchers all get different versions of the same country.'],
  ['What do the prices mean?', 'The figures shown are the starting prices published on our current site. They are not final quotes — send us your dates and group size and we will confirm exactly what is included before you commit to anything.'],
];

const REVIEWS = [
  { name: 'Ameme C', meta: 'Solo · December 2024', title: 'adventure',
    text: 'They emphasize offering authentic Mauritanian travel experiences: desert camps, coastal retreats, cultural tours, wildlife, etc.',
    date: 'Written 3 October 2025', av: 'portrait-cheche-regard', src: 'Tripadvisor' },
  { name: 'Bouye C', meta: 'Nouakchott, Mauritania · 16 contributions',
    title: 'I did the 8 days package, was a great trip recommend it',
    text: 'I had a great time spending with the group an the team of horizons agency did a great services',
    date: 'Travelled with friends · September 2025', av: 'equipe-tshirt-pirogue', src: 'Tripadvisor',
    pics: ['vehicule-interieur-village', 'train-fer-pause-desert', 'terjit-palmeraie', 'ouadane-ruines-panneau'] },
];

/* Témoignages publiés sur le site actuel. Seuls les THÈMES ont pu être
   extraits, pas les textes intégraux — on les présente donc comme des
   sujets d'éloge, sans guillemets. Mettre des mots inventés entre
   guillemets sous le nom d'une personne réelle n'est pas envisageable. */
const SITE_QUOTES = [
  ['Fabrice', 'France', 'Praised our professionalism, the passion of the team, and the Adrar expedition — its landscapes and its cultural immersion.'],
  ['Hilario J. Rodríguez', 'Spain', 'Praised the Mauritanian desert, the expertise of the team, the passion of the guides and the warmth of the welcome.'],
  ['Foulque', 'France', 'Praised Chinguetti and the ancient cities, the organisation, the cultural explanations and the desert landscapes.'],
  ['Vironika Banache', 'Poland', 'Praised the desert adventure, the attention to detail, the comfort and the nights under the stars.'],
];

/* ═══════════════════════════════════════════════════════ HELPERS ═════ */

const img = (base, w, cls, alt, extra = '') =>
  `<img src="${'$B$'}assets/img/${base}-${w}.webp" alt="${alt || ''}"${cls ? ` class="${cls}"` : ''} loading="lazy" decoding="async"${extra}>`;

const heroImg = (base, alt) =>
  `<img src="${'$B$'}assets/img/${base}-full.webp" srcset="${'$B$'}assets/img/${base}-480.webp 480w, ${'$B$'}assets/img/${base}-900.webp 900w, ${'$B$'}assets/img/${base}-full.webp 1170w" sizes="100vw" alt="${alt}" fetchpriority="high">`;

const money = (j) => j.price == null ? 'On request' : `From $${j.price}`;


/* ── motifs du désert ────────────────────────────────────────────────── */
// Crête de dune : profil asymétrique — montée douce, face d'avalanche raide.
const dune = (fill, dir = 'up') =>
  `<div class="dune dune--${dir}" aria-hidden="true"><svg viewBox="0 0 1440 90" preserveAspectRatio="none">
    <path fill="${fill}" d="M0,74 C170,74 250,24 430,20 C610,16 690,58 880,62 C1040,66 1150,34 1290,26 C1360,22 1410,30 1440,38 L1440,90 L0,90 Z"/>
  </svg></div>`;

// Dromadaire stylisé, de profil, orienté vers la droite.
const CAMEL = `<path d="M34,60 C31,74 29,86 28,102 L35,102 C36,86 38,74 41,62 Z"/>
<path d="M48,62 C47,76 46,88 46,102 L52,102 C53,88 54,76 55,63 Z"/>
<path d="M72,60 C72,74 71,87 70,102 L77,102 C78,87 79,74 80,61 Z"/>
<path d="M84,58 C85,72 86,87 87,102 L93,102 C92,87 91,72 90,58 Z"/>
<path d="M28,52 C28,40 44,33 60,33 C76,33 90,38 94,48 C97,56 94,63 86,65 C70,69 44,69 34,64 C29,62 28,57 28,52 Z"/>
<path d="M44,38 C50,16 70,14 78,34 C70,30 54,30 44,38 Z"/>
<path d="M88,44 C94,34 98,24 100,14 C101,8 106,6 109,9 C112,12 111,16 114,18 C118,20 118,25 113,26 L106,25 C103,32 99,41 96,50 Z"/>
<path d="M28,46 C23,50 20,58 19,66 L23,66 C25,58 28,53 31,50 Z"/>`;

const caravan = () => `<div class="caravan" aria-hidden="true">
  <div class="caravan__track">
    <svg viewBox="0 0 470 112" fill="currentColor">
      <g transform="translate(0,4) scale(.92)">${CAMEL}<path d="M58,30 C58,22 66,20 68,26 C70,20 74,22 73,30 C70,34 62,34 58,30 Z"/></g>
      <g transform="translate(132,12) scale(.82)">${CAMEL}</g>
      <g transform="translate(248,18) scale(.74)">${CAMEL}</g>
      <g transform="translate(350,24) scale(.66)">${CAMEL}</g>
    </svg>
  </div>
  <div class="caravan__line"></div>
</div>`;

const NAV = [
  ['journeys/index.html', 'Journeys'],
  ['reviews/index.html', 'Reviews'],
  ['guide/index.html', 'Travel guide'],
  ['services/index.html', 'Services'],
  ['blog/index.html', 'Blog'],
  ['about/index.html', 'About'],
];

function shell({ title, desc, body, base, clock, jsonld = '', extraJs = '', canon = '' }) {
  const B = base;
  const nav = NAV.map(([h, t]) => `<a href="${B}${h}">${t}</a>`).join('\n        ');
  const ovl = [...NAV, ['book/index.html', 'Book a journey'], ['contact/index.html', 'Contact']]
    .map(([h, t], i) => `<a href="${B}${h}" data-n="0${i + 1}"><span>${t}</span></a>`).join('\n      ');

  return `<!DOCTYPE html>
<html lang="en" data-base="${B}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#0B0A09">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Mauritania Horizons">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="https://mauritaniahorizons.com/assets/img/richat-vue-aerienne-full.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://mauritaniahorizons.com/${canon}">
<link rel="icon" href="${B}source/brand/logo-brand.png">
<link rel="stylesheet" href="${B}assets/css/site.css">
<script>if(location.protocol==='file:'){var l=document.createElement('link');l.rel='stylesheet';
l.href='${B}assets/css/fonts-inline.css';document.head.appendChild(l);}</script>
${jsonld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="wa" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 2a8 8 0 11-4.1 14.9l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 0112 4zm-3.2 4.3c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.5.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.3l-1.5-.7c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.3-1.6-1.5-1.8-.1-.3 0-.4.1-.5l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5l-.7-1.6c-.2-.4-.3-.4-.5-.4h-.5z"/></symbol>
</svg>

<header class="top">
  <div class="top__in">
    <a class="top__logo" href="${B}index.html" aria-label="Mauritania Horizons — home">
      <img src="${B}source/brand/logo-brand.png" alt="Mauritania Horizons" width="478" height="462">
    </a>
    <nav class="top__n" aria-label="Primary">
        ${nav}
    </nav>
    <div class="top__r">
      <span class="lang"><b class="on">EN</b><b>FR</b></span>
      <a class="btn btn--s btn--sm" href="${B}book/index.html">Plan a trip</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="ovl" aria-label="Menu">
        <i></i><i></i><i></i></button>
    </div>
  </div>
</header>

<div class="ovl" id="ovl" aria-hidden="true">
  <div class="ovl__sky" aria-hidden="true">
    <svg class="ovl__dune" viewBox="0 0 1440 220" preserveAspectRatio="none">
      <path fill="currentColor" d="M0,168 C190,168 270,104 470,96 C660,88 740,140 940,146 C1100,150 1220,110 1440,92 L1440,220 L0,220 Z"/>
    </svg>
    <svg class="ovl__cam" viewBox="0 0 470 112" fill="currentColor">
      <g transform="translate(0,4) scale(.92)">${CAMEL}<path d="M58,30 C58,22 66,20 68,26 C70,20 74,22 73,30 C70,34 62,34 58,30 Z"/></g>
      <g transform="translate(132,12) scale(.82)">${CAMEL}</g>
      <g transform="translate(248,18) scale(.74)">${CAMEL}</g>
    </svg>
  </div>
  <nav class="ovl__n" aria-label="Menu">
      ${ovl}
  </nav>
  <p class="ovl__q">Follow the old caravan routes — <em>we know where they go</em>.</p>
  <div class="ovl__f tiny">
    <a href="tel:+22246656594">${PHONE}</a>
    <a href="mailto:${MAIL}">${MAIL}</a>
    <span>ZRC N°334, Tevragh Zeina — Nouakchott</span>
  </div>
</div>

${clock ? `<nav class="clock" aria-hidden="true"><span class="on">05:40</span><span>13:00</span><span>18:50</span><span>23:15</span></nav>` : ''}

<main id="main">
${body}
</main>

<footer class="ft">
  <div class="shell">
    <div class="ft__g">
      <div>
        <span class="ft__logo"><img src="${B}source/brand/logo-brand.png" alt="Mauritania Horizons" width="478" height="462"></span>
        <p class="say" style="margin-top:1.3rem;max-width:30ch">Authentic journeys through the world's last great Sahara. Licensed operator, Nouakchott, since 2023.</p>
      </div>
      <div><h4>Journeys</h4><ul>
        ${JOURNEYS.map(j => `<li><a href="${B}journeys/${j.slug}.html">${j.title.replace('Mauritania Explorer: ', '')}</a></li>`).join('\n        ')}
      </ul></div>
      <div><h4>Practical</h4><ul>
        <li><a href="${B}guide/index.html">Travel guide</a></li>
        <li><a href="${B}guide/index.html#visa">Visa</a></li>
        <li><a href="${B}services/index.html">Car rental</a></li>
        <li><a href="${B}reviews/index.html">Reviews</a></li>
        <li><a href="${B}blog/index.html">Blog</a></li>
        <li><a href="${B}about/index.html">About us</a></li>
      </ul></div>
      <div><h4>Contact</h4><ul>
        <li><a href="tel:+22246656594">${PHONE}</a></li>
        <li><a href="mailto:${MAIL}">${MAIL}</a></li>
        <li><a href="mailto:mome@mauritaniahorizons.com">mome@mauritaniahorizons.com</a></li>
        <li>ZRC N°334, Tevragh Zeina<br>Nouakchott, Mauritania</li>
      </ul>
      <p style="margin-top:1.2rem"><a class="btn btn--l btn--sm" href="${B}book/index.html">Plan a journey</a></p>
      </div>
    </div>
    <div class="ft__b">
      <span>© 2026 Mauritania Horizons — approved by the Mauritanian state</span>
      <span>Mock-up · content pending final validation</span>
    </div>
  </div>
</footer>

<a class="expert" data-wa="Hello Mauritania Horizons, I have a question about your journeys." href="#">
  <svg><use href="#wa"/></svg> Chat with a travel expert</a>

<div class="sticky">
  <a class="w" data-wa="Hello Mauritania Horizons," href="#"><svg><use href="#wa"/></svg> WhatsApp</a>
  <a class="p" href="${B}book/index.html">Plan my trip</a>
</div>

<script src="${B}assets/js/site.js" defer></script>${extraJs}
</body>
</html>`.replace(/\$B\$/g, B);
}

/* ═══════════════════════════════════════════════════ CORPS DE PAGES ══ */

function journeyRows(B, limit) {
  return JOURNEYS.slice(0, limit || JOURNEYS.length).map(j => `
    <a class="row" href="${B}journeys/${j.slug}.html">
      <span class="n">${j.n}</span>
      <div><h3>${j.title}</h3><div class="d">${j.line}</div></div>
      <span class="p">${j.days} day${j.days > 1 ? 's' : ''} — ${money(j)}</span>
    </a>`).join('');
}

function journeyCards(B) {
  return JOURNEYS.map(j => `
    <a class="card rv" href="${B}journeys/${j.slug}.html">
      <div class="card__m"><span class="card__d">${j.days} day${j.days > 1 ? 's' : ''}</span>
        <img src="${B}assets/img/${j.img}-900.webp" srcset="${B}assets/img/${j.img}-480.webp 480w, ${B}assets/img/${j.img}-900.webp 900w" sizes="(min-width:1080px) 32vw, (min-width:700px) 48vw, 100vw" alt="${j.title}" loading="lazy" decoding="async"></div>
      <div class="card__b">
        <h3>${j.title}</h3>
        <p>${j.blurb}</p>
        <div class="card__f"><span>${j.line.split(' · ').slice(0, 2).join(' · ')}</span><span>${money(j)}</span></div>
      </div>
    </a>`).join('');
}

/* ------------------------------------------------------------ ACCUEIL */
function home(B) {
  return `
<div class="hour" data-hour id="dawn">
  ${heroImg('richat-vue-aerienne', 'The Richat Structure — the Eye of the Sahara, seen from the air')}
  <div class="in">
    <p class="eyebrow">Mauritania · West Africa</p>
    <h1 class="d1">The Sahara,<br>unlike anywhere else.</h1>
    <p class="say" style="margin-top:1.4rem">Ancient caravan cities, endless dunes, nomadic
      traditions, wild Atlantic coastlines and one of the world's last great overland adventures.</p>
    <div style="display:flex;flex-wrap:wrap;gap:.7rem;margin-top:2rem">
      <a class="btn btn--l" href="${B}journeys/index.html">Explore our journeys</a>
      <a class="btn btn--o" style="color:#fff" href="${B}book/index.html">Plan my trip</a>
    </div>
  </div>
</div>

<div class="shell">
  <form class="planner" data-planner autocomplete="off" action="${B}book/index.html">
    <div class="fld"><label for="pj">Where do you want to go?</label>
      <select id="pj" name="journey"><option value="">All journeys</option>
      ${JOURNEYS.map(j => `<option value="${j.slug}">${j.title} — ${j.days} day${j.days > 1 ? 's' : ''}</option>`).join('')}
      </select></div>
    <div class="fld"><label for="pa">When?</label><input type="date" id="pa" name="arrival"></div>
    <div class="fld"><label for="pt">Travellers</label>
      <select id="pt" name="adults"><option>3</option><option>2</option><option>4</option><option>5</option></select></div>
    <button class="btn btn--l" type="submit">Plan my journey</button>
  </form>
</div>

${dune("var(--ivory-2)")}
<div class="trust">
  <div class="shell" style="padding-inline:0">
    <div class="trust__g">
      <div class="trust__i"><b>Licensed by the State</b><span>Approved Mauritanian tour operator</span></div>
      <div class="trust__i"><b>Local since 2023</b><span>Mauritanian team, Mauritanian guides</span></div>
      <div class="trust__i"><b>24/7 assistance</b><span>Throughout your stay, on and off the piste</span></div>
      <div class="trust__i"><b>We run our own trips</b><span>Own 4×4s, own drivers, no subcontracting</span></div>
    </div>
  </div>
</div>


<section class="band">
  <img src="${B}assets/img/ouadane-vieille-ville-full.webp" alt="The ruins of the upper city of Ouadane" loading="lazy" decoding="async">
  <div class="band__in">
    <p class="eyebrow" style="color:var(--sand)">Why Mauritania</p>
    <h2 class="d2 rv">There are places you visit.<br>And places you <em class="hl" style="color:var(--sand)">remember forever</em>.</h2>
    <p class="say rv" data-d="1">Mauritania is the size of Egypt and receives fewer visitors in a
      year than a single European city takes in a weekend. Almost nothing here has been arranged
      for tourists — which is precisely the point.</p>
  </div>
</section>

<section class="hour sun on-sun" data-hour id="noon">
  <span class="mark">13:00 — Nothing in any direction</span>
  <div class="in">
    <div class="two two--offset">
      <div>
        <h2 class="d2 rv">Two hundred kilometres to the next anything.</h2>
        <p class="say rv" data-d="1" style="margin-top:1.4rem">No fence, no pylon, no engine but yours.
          The horizon does not get closer. This is the part people try to describe afterwards and can't.</p>
        <div class="temps rv" data-d="2">
          <div><b>45°</b><span>At noon</span></div>
          <div><b>4°</b><span>At three in the morning</span></div>
          <div><b>0</b><span>Bars of signal</span></div>
        </div>
      </div>
      <img class="r43 rv" data-d="1" src="${B}assets/img/train-fer-pause-desert-900.webp" alt="A traveller alone on the ore wagons" loading="lazy" decoding="async">
    </div>
  </div>
</section>

<section class="hour veil-dusk" data-hour id="dusk">
  ${heroImg('train-fer-coucher-soleil', 'The iron ore railway at sunset')}
  <span class="mark">18:50 — The train comes through</span>
  <div class="in" style="display:flex;flex-direction:column;justify-content:center">
    <h2 class="d2">Then you hear it before you see it.</h2>
    <p class="say" style="margin-top:1.4rem">Two kilometres of iron ore, crossing the Sahara at walking
      pace. You climb on, and you ride it into the dark.</p>
    <p class="tiny" style="margin-top:2rem">Choum → Nouadhibou · one night · six-day journey</p>
    <p style="margin-top:1.6rem"><a class="btn btn--l" href="${B}journeys/sahara-iron-ore-train.html">The six-day journey</a></p>
  </div>
</section>

<section class="hour night" data-hour id="night">
  <svg class="stars" aria-hidden="true"></svg>
  <span class="mark">23:15 — The sky turns on</span>
  <div class="in">
    <div class="two two--l">
      <div>
        <h2 class="d2 rv">And then there is nothing above you but everything.</h2>
        <p class="say rv" data-d="1" style="margin-top:1.4rem">The nearest street light is two hundred
          kilometres away. Tea goes round three times. Someone puts more wood on the fire. Nobody
          goes to bed early.</p>
        <p class="tiny rv" data-d="2" style="margin-top:2rem">Bivouacs on every journey · camps pitched by our own crews</p>
      </div>
      <img class="r11 rv" data-d="1" src="${B}assets/img/danse-feu-nuit-900.webp" alt="Dancing by firelight at a desert camp" loading="lazy" decoding="async">
    </div>
  </div>
</section>

<section id="journeys">
  <div class="shell">
    <div class="lead">
      <div><p class="tiny" style="margin-bottom:.9rem">Now the practical part</p>
        <h2 class="d2">Six ways to be out there.</h2></div>
      <p class="tiny" style="max-width:26ch">Licensed operator · Nouakchott · since 2023</p>
    </div>
    <div class="cards cards--3 ghost" data-ghost="06">${journeyCards(B)}</div>
    <p style="margin-top:2.6rem"><a class="btn btn--o" href="${B}journeys/index.html">All journeys in detail</a></p>
  </div>
</section>


<div class="railwrap">
  <div class="shell"><div class="lead" style="border:0;padding-bottom:1.2rem">
    <div><p class="eyebrow">Destinations</p>
      <h2 class="d2 rv">Where we take you.</h2></div>
    <p class="tiny rail__hint" style="padding:0">Drag to explore →</p>
  </div></div>
  <div class="rail">
    <a class="dest" href="${B}journeys/index.html"><img src="${B}assets/img/chinguetti-ruelle-480.webp" alt="Chinguetti" loading="lazy">
      <div class="dest__c"><h3 class="d4">Chinguetti</h3><p>A city built by caravans — libraries of medieval manuscripts, still in family hands.</p></div></a>
    <a class="dest" href="${B}journeys/index.html"><img src="${B}assets/img/ouadane-tour-pierre-480.webp" alt="Ouadane" loading="lazy">
      <div class="dest__c"><h3 class="d4">Ouadane</h3><p>UNESCO-listed ruins of the upper city, above the palm valley.</p></div></a>
    <a class="dest" href="${B}journeys/index.html"><img src="${B}assets/img/richat-vue-aerienne-480.webp" alt="Richat Structure" loading="lazy">
      <div class="dest__c"><h3 class="d4">The Richat</h3><p>Forty kilometres of concentric rock — the Eye of the Sahara.</p></div></a>
    <a class="dest" href="${B}journeys/index.html"><img src="${B}assets/img/terjit-palmeraie-480.webp" alt="Terjit" loading="lazy">
      <div class="dest__c"><h3 class="d4">Terjit</h3><p>A fault in the rock hiding a palm grove and freshwater springs.</p></div></a>
    <a class="dest" href="${B}journeys/index.html"><img src="${B}assets/img/train-fer-wagon-minerai-480.webp" alt="The iron ore train" loading="lazy">
      <div class="dest__c"><h3 class="d4">The ore train</h3><p>Choum to Nouadhibou, one night on the longest train on earth.</p></div></a>
    <a class="dest" href="${B}journeys/index.html"><img src="${B}assets/img/marche-artisanat-480.webp" alt="Nouakchott" loading="lazy">
      <div class="dest__c"><h3 class="d4">Nouakchott</h3><p>The fishing port at dusk, the markets, and dunes at the city's edge.</p></div></a>
  </div>
</div>

${caravan()}
<div class="tick"><div class="tick__in" data-tick>
  <b>“desert camps, coastal retreats, cultural tours”<i>Ameme C · Tripadvisor</i></b>
  <b>“was a great trip, recommend it”<i>Bouye C · Nouakchott</i></b>
  <b>“authentic Mauritanian travel experiences”<i>Ameme C · Solo</i></b>
  <b>“the team of horizons agency did a great services”<i>Bouye C</i></b>
  <b>“nights under the stars I still think about”<i>Vironika · Poland</i></b>
  <b>“guides who clearly love this desert”<i>Hilario · Spain</i></b>
</div></div>

<section>
  <div class="shell">
    <div class="two">
      <div>
        <p class="tiny tiny--b" style="margin-bottom:1rem">Who takes you</p>
        <h2 class="d2 rv">The people who know these dunes by heart.</h2>
        <p class="say rv" data-d="1" style="margin-top:1.4rem">Founded in Nouakchott in 2023 and
          licensed by the Mauritanian state. We run our own 4×4s, our own crews and our own camps —
          nothing is subcontracted. Our guides, cooks and camel handlers are Mauritanian and paid
          locally, and the towns we work in — Chinguetti, Ouadane, Tichitt — depend on visitors
          arriving well.</p>
        <p class="rv" data-d="2" style="margin-top:2rem">
          <a class="btn btn--o" href="${B}about/index.html">About the agency</a></p>
      </div>
      <img class="r43 rv" data-d="1" src="${B}assets/img/bibliothecaire-manuscrits-900.webp" alt="A librarian in Chinguetti with his family's manuscripts" loading="lazy" decoding="async">
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="shell">
    <hr class="line">
    <div class="two" style="margin-top:var(--sp);align-items:center">
      <div>
        <h2 class="d2 rv">Your dates. Your pace.<br>Your Mauritania.</h2>
        <p class="say rv" data-d="1" style="margin-top:1.3rem">Couples, families, photographers, film
          crews, researchers. Tell us what you want to see — we build the vehicles, guides, camps and
          permits around it, and reply within 24 hours.</p>
      </div>
      <div class="rv" data-d="1" style="display:flex;flex-wrap:wrap;gap:.8rem">
        <a class="btn btn--l" href="${B}book/index.html">Start planning</a>
        <a class="btn btn--o" data-wa="Hello Mauritania Horizons, I would like to plan a trip." href="#">
          <svg style="width:16px;height:16px"><use href="#wa"/></svg> WhatsApp</a>
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------- LISTE DES CIRCUITS */
function journeysIndex(B) {
  return `
<section class="hour" style="min-height:70svh">
  ${heroImg('ouadane-arches-pierre', 'Stone arches in the ruins of Ouadane')}
  <div class="in" style="display:flex;flex-direction:column;justify-content:flex-end;min-height:70svh">
    <p class="tiny">Six journeys</p>
    <h1 class="d1" style="margin-top:1rem">One day, or twelve.</h1>
    <p class="say" style="margin-top:1.3rem">Every itinerary below is real and running. Every one of
      them can be rewritten around your dates.</p>
  </div>
</section>

<section>
  <div class="shell">
    <div class="cards cards--3">${journeyCards(B)}</div>
    <p class="tiny" style="margin-top:2.6rem;max-width:70ch">Prices shown are the starting figures
      published on our current site — not final quotes. Send us your dates and group size and we
      confirm exactly what is included.</p>
  </div>
</section>`;
}

/* -------------------------------------------------------- FICHE TOUR */
function journeyPage(B, j) {
  const days = j.itinerary ? `
<section id="itinerary">
  <div class="shell">
    <div class="lead"><div><p class="tiny tiny--b" style="margin-bottom:.8rem">Day by day</p>
      <h2 class="d2">${j.days === 1 ? 'The day' : `${j.days} days`}, in order.</h2></div></div>
    <ol class="days">
      ${j.itinerary.map(dd => `
      <li class="day rv">
        <div class="day__n">${j.days === 1 ? 'Stop' : 'Day'} ${dd.d}</div>
        <div><h3>${dd.t}</h3><p>${dd.p}</p><div class="day__s">${dd.s}</div></div>
        <img src="${B}assets/img/${dd.img}-480.webp" alt="" loading="lazy" decoding="async">
      </li>`).join('')}
    </ol>
  </div>
</section>` : `
<section>
  <div class="shell">
    <div class="lead"><div><p class="tiny tiny--b" style="margin-bottom:.8rem">Day by day</p>
      <h2 class="d2">The full itinerary.</h2></div></div>
    <p class="say" style="margin-top:1.8rem">The detailed day-by-day for this journey is confirmed
      with you when you enquire — it shifts with the season, the group and the state of the pistes.
      Ask us for the current version and we will send it before you commit to anything.</p>
    <p style="margin-top:1.8rem"><a class="btn btn--l" href="${B}book/index.html?journey=${j.slug}">Request the itinerary</a></p>
  </div>
</section>`;

  return `
<section class="hour" style="min-height:88svh">
  ${heroImg(j.hero, j.title)}
  <div class="in" style="display:flex;flex-direction:column;justify-content:flex-end;min-height:88svh">
    <p class="tiny">${j.strap}</p>
    <h1 class="d1" style="margin-top:1rem;max-width:16ch">${j.title}</h1>
    <div class="temps" style="margin-top:2rem">
      <div><b>${j.days}</b><span>Day${j.days > 1 ? 's' : ''}</span></div>
      <div><b>${j.min}</b><span>Travellers minimum</span></div>
      <div><b>${j.price == null ? '—' : '$' + j.price}</b><span>${j.price == null ? 'On request' : 'Starting price'}</span></div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:.8rem;margin-top:2rem">
      <a class="btn btn--l" href="${B}book/index.html?journey=${j.slug}">Book this journey</a>
      <a class="btn btn--o" data-wa="Hello Mauritania Horizons, I have a question about the ${j.title}." href="#">Ask a travel expert</a>
    </div>
  </div>
</section>

<section>
  <div class="shell">
    <div class="two">
      <div>
        <p class="tiny tiny--b" style="margin-bottom:1rem">Why you'll love it</p>
        <h2 class="d2 rv">${j.strap}</h2>
        <p class="say rv" data-d="1" style="margin-top:1.3rem">${j.blurb}</p>
      </div>
      <div class="rv" data-d="1">
        ${j.love.map(([t, p]) => `<div style="padding:1.2rem 0;border-top:1px solid var(--line)">
          <h3 class="d4">${t}</h3><p class="say" style="margin-top:.5rem">${p}</p></div>`).join('')}
      </div>
    </div>
  </div>
</section>

${days}

<section class="night">
  <svg class="stars" aria-hidden="true"></svg>
  <div class="shell">
    <div class="incl">
      <div>
        <p class="tiny tiny--b" style="margin-bottom:.9rem">What's included</p>
        <h2 class="d3 rv">In the price.</h2>
        <ul class="ilist rv" data-d="1">
          ${INCLUDED.map(([t, p]) => `<li><span><b style="color:#fff;font-weight:400">${t}.</b> ${p}</span></li>`).join('')}
        </ul>
      </div>
      <div>
        <p class="tiny tiny--b" style="margin-bottom:.9rem">What's not</p>
        <h2 class="d3 rv">Not in the price.</h2>
        <ul class="ilist ilist--no rv" data-d="1">
          ${EXCLUDED.map(([t, p]) => `<li><span><b style="color:#fff;font-weight:400">${t}.</b> ${p}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="shell">
    <p class="tiny tiny--b" style="margin-bottom:.9rem">On this journey</p>
    <div class="cards cards--3" style="margin-top:1.5rem">
      ${j.gallery.filter(g => g !== 'bivouac-placeholder').map(g => `<img class="r34 rv" src="${B}assets/img/${g}-480.webp" alt="" loading="lazy" decoding="async">`).join('')}
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="shell">
    <div class="lead"><div><p class="tiny tiny--b" style="margin-bottom:.8rem">Questions</p>
      <h2 class="d2">Before you book.</h2></div></div>
    <div class="faq" style="margin-top:2rem">
      ${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}
    </div>
    <p style="margin-top:2.6rem;display:flex;gap:.8rem;flex-wrap:wrap">
      <a class="btn btn--l" href="${B}book/index.html?journey=${j.slug}">Book this journey</a>
      <a class="btn btn--o" href="${B}journeys/index.html">Other journeys</a>
    </p>
  </div>
</section>`;
}

/* ═══════════════════════════════════════════════════════ ÉCRITURE ════ */
function write(rel, html) {
  const p = path.join(R, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, html);
  console.log('  ' + rel + '  ' + (html.length / 1024).toFixed(1) + ' kB');
}

module.exports = { JOURNEYS, INCLUDED, EXCLUDED, FAQ, REVIEWS, SITE_QUOTES,
  shell, write, journeyCards, journeyRows, heroImg, money, home, journeysIndex,
  journeyPage, PHONE, WA, MAIL };

if (require.main === module) require('./build-pages.js');
