/* ═══════════════════════════════════════════════════════════════════════
   BLOG — CONTENU UNIQUEMENT

   Aucune nouvelle mise en page, aucun nouveau composant, aucune nouvelle
   couleur, aucune nouvelle typographie. Cette page est rendue par le
   shell() existant et n'utilise que des classes déjà présentes dans
   assets/css/site.css : .hour.sun / .in / .shell / .cards.cards--3 /
   .card + .card__m / .card__d / .card__b / .card__f / .btn / .tiny / .rv.

   Les textes ci-dessous (titres, dates, catégories, extraits, slugs)
   sont repris tels quels du client. Rien n'est inventé.
   ═══════════════════════════════════════════════════════════════════════ */

const S = require('./build-site.js');
const { shell, write } = S;

/* ── contenu fourni par le client — ne rien modifier ─────────────────── */
const PAGE_TITLE = 'Mauritania Travel Blog';
const PAGE_DESC = 'Discover Mauritania through travel guides, desert adventures, ' +
  'practical travel advice, cultural insights, and expert tips for exploring the country.';

const CAT = 'Uncategorized';

const POSTS = [
  {
    title: 'How Many Days in Mauritania for a Desert Trip?',
    date: 'August 13, 2026', iso: '2026-08-13',
    excerpt: 'Wondering how many days in Mauritania you need? Plan the right pace for desert cities, the Eye of Africa, the coast, and the Iron Ore Train in comfort.',
    slug: 'how-many-days-in-mauritania-for-a-desert-trip',
    photo: 'Mauritanian Sahara desert · 4x4 expedition',
  },
  {
    title: '7 Best Mauritania Desert Routes for 2026',
    date: 'August 11, 2026', iso: '2026-08-11',
    excerpt: 'Find the best Mauritania desert routes, from Chinguetti to the Eye of the Sahara, with expert advice on timing, comfort, and route planning for travelers.',
    slug: '7-best-mauritania-desert-routes-for-2026',
    photo: 'Sahara dunes · desert route',
  },
  {
    title: 'Mauritania Visa Assistance Made Simple',
    date: 'June 19, 2026', iso: '2026-06-19',
    excerpt: 'Mauritania visa assistance helps travelers avoid delays, understand entry rules, and prepare the right documents for a smooth arrival in Mauritania.',
    slug: 'mauritania-visa-assistance-made-simple',
    photo: 'Mauritania passport · visa documents',
  },
  {
    title: 'Mauritania or Morocco Travel: Which Fits You?',
    date: 'June 17, 2026', iso: '2026-06-17',
    excerpt: 'Mauritania or Morocco travel – compare culture, landscapes, pace, comfort, and adventure to choose the North African journey that fits you best.',
    slug: 'mauritania-or-morocco-travel-which-fits-you',
    photo: 'Mauritania vs Morocco · North African landscapes',
  },
  {
    title: 'A Guide to Mauritania Visa Process',
    date: 'June 15, 2026', iso: '2026-06-15',
    excerpt: 'A clear guide to Mauritania visa process, including entry options, documents, timing, fees, and practical tips for a smooth arrival.',
    slug: 'a-guide-to-mauritania-visa-process',
    photo: 'Traveler arriving in Mauritania',
  },
  {
    title: 'How to Ride Iron Ore Train in Mauritania',
    date: 'June 13, 2026', iso: '2026-06-13',
    excerpt: 'Learn how to ride Iron Ore Train in Mauritania with practical advice on routes, safety, comfort, timing, and whether to go independently or guided.',
    slug: 'how-to-ride-iron-ore-train-in-mauritania',
    photo: 'Iron Ore Train crossing the Sahara',
  },
  {
    title: 'Mauritania Desert Tours Worth Taking',
    date: 'June 11, 2026', iso: '2026-06-11',
    excerpt: 'Mauritania desert tours reveal vast dunes, ancient caravan towns, luxury camps, and remote Sahara routes with expert planning and authentic access.',
    slug: 'mauritania-desert-tours-worth-taking',
    photo: 'Mauritania desert camp · dunes',
  },
  {
    title: 'How to Explore Banc dArguin the Right Way',
    date: 'June 9, 2026', iso: '2026-06-09',
    excerpt: 'Learn how to explore Banc dArguin with expert timing, routes, wildlife insights, and comfort tips for a rare, refined Mauritania journey.',
    slug: 'how-to-explore-banc-darguin-the-right-way',
    photo: "Banc d'Arguin coastline · birds",
  },
  {
    title: 'Guided or Self Drive Mauritania?',
    date: 'June 7, 2026', iso: '2026-06-07',
    excerpt: 'Guided or self drive Mauritania? Compare safety, logistics, comfort, and freedom to choose the right way to experience deserts, culture, and coast.',
    slug: 'guided-or-self-drive-mauritania',
    photo: '4x4 driving through the desert',
  },
  {
    title: 'What to Wear in Mauritania',
    date: 'June 5, 2026', iso: '2026-06-05',
    excerpt: 'Wondering what to wear Mauritania? Our guide covers desert layers, city dress, coastal conditions, and cultural etiquette for smart packing.',
    slug: 'what-to-wear-in-mauritania',
    photo: 'Mauritanian traditional clothing · desert traveler',
  },
];

const PAGES = 5;   // le blog compte 5 pages au total

/* ── placeholder photo ────────────────────────────────────────────────
   Pas de photo inventée, pas de banque d'images : un SVG inline qui
   nomme la photo attendue et son emplacement final. Il passe par
   <img> et hérite donc exactement du style .card__m img existant.

   Pour poser la vraie photo, remplacer simplement l'attribut src par
   la valeur de data-photo — rien d'autre à toucher.                   */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function wrapText(text, max) {
  const out = []; let line = '';
  for (const w of text.split(' ')) {
    if ((line + ' ' + w).trim().length > max) { out.push(line.trim()); line = w; }
    else line += ' ' + w;
  }
  if (line.trim()) out.push(line.trim());
  return out;
}

function placeholder(subject, file) {
  const lines = wrapText(subject, 26);
  const startY = 342 - (lines.length - 1) * 19;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">` +
    `<rect width="800" height="600" fill="#E5D8C1"/>` +
    `<path d="M0,470 C160,470 250,404 400,398 C548,392 640,440 800,414 L800,600 L0,600 Z" fill="#D5C4A6"/>` +
    `<rect x="24" y="24" width="752" height="552" fill="none" stroke="#C4B190" stroke-width="2" stroke-dasharray="10 8"/>` +
    `<circle cx="400" cy="196" r="44" fill="none" stroke="#AD9970" stroke-width="2"/>` +
    `<path d="M376,216 l18,-22 13,15 11,-13 17,20 z" fill="#AD9970"/>` +
    `<circle cx="382" cy="180" r="7" fill="#AD9970"/>` +
    `<text x="400" y="284" text-anchor="middle" font-family="Inter,Helvetica,Arial,sans-serif" ` +
    `font-size="17" letter-spacing="4" fill="#8C4A2C">PHOTO PLACEHOLDER</text>` +
    lines.map((l, i) => `<text x="400" y="${startY + i * 38}" text-anchor="middle" ` +
      `font-family="Georgia,serif" font-size="30" fill="#191714">${esc(l)}</text>`).join('') +
    `<text x="400" y="548" text-anchor="middle" font-family="Inter,Helvetica,Arial,sans-serif" ` +
    `font-size="15" fill="#6E6353">${esc(file)}</text>` +
    `</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const photoFile = (p) => `assets/img/blog/${p.slug}.jpg`;

/* ── carte d'article — structure .card identique à celle des voyages ── */
function postCard(B, p) {
  return `
    <a class="card rv" href="${B}blog/${p.slug}/index.html">
      <div class="card__m"><span class="card__d">${CAT}</span>
        <img src="${placeholder(p.photo, '/' + photoFile(p))}" data-photo="${B}${photoFile(p)}"
             alt="Photo placeholder — ${esc(p.photo)}" loading="lazy" decoding="async"></div>
      <div class="card__b">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.excerpt)}</p>
        <div class="card__f"><span>${p.date}</span><span>Read more</span></div>
      </div>
    </a>`;
}

/* ── pagination — 1 2 … 5 Next → ─────────────────────────────────────
   Uniquement des .btn existants, disposés en flex inline.            */
const pageHref = (B, n) => n === 1 ? `${B}blog/index.html` : `${B}blog/page/${n}/index.html`;

function pagination(B, cur) {
  const nums = new Set([1, 2, PAGES, cur, cur - 1, cur + 1]);
  const shown = [...nums].filter(n => n >= 1 && n <= PAGES).sort((a, b) => a - b);
  const items = [];
  let prev = 0;
  for (const n of shown) {
    if (n - prev > 1) items.push(`<span class="tiny" style="padding:0 .2rem">…</span>`);
    items.push(n === cur
      ? `<span class="btn btn--s btn--sm" aria-current="page">${n}</span>`
      : `<a class="btn btn--o btn--sm" href="${pageHref(B, n)}">${n}</a>`);
    prev = n;
  }
  if (cur > 1) items.unshift(`<a class="btn btn--o btn--sm" href="${pageHref(B, cur - 1)}">← Previous</a>`);
  if (cur < PAGES) items.push(`<a class="btn btn--o btn--sm" href="${pageHref(B, cur + 1)}">Next →</a>`);

  return `
    <nav aria-label="Blog pages"
         style="display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;margin-top:clamp(2.6rem,5vw,4rem)">
      ${items.join('\n      ')}
    </nav>`;
}

/* ── en-tête de page ─────────────────────────────────────────────────── */
function pageHead(cur) {
  return `
<section class="hour sun" style="padding-top:clamp(8rem,15vw,11rem);padding-bottom:clamp(1.4rem,3vw,2.6rem)">
  <div class="in">
    <p class="tiny tiny--b">Journal${cur > 1 ? ` — page ${cur} of ${PAGES}` : ''}</p>
    <h1 class="d1" style="margin-top:1rem;max-width:15ch">${PAGE_TITLE}</h1>
    <p class="say" style="margin-top:1.4rem;max-width:64ch">${PAGE_DESC}</p>
  </div>
</section>`;
}

/* ── page de liste ───────────────────────────────────────────────────── */
function listPage(B, cur) {
  const body = cur === 1
    ? `<div class="cards cards--3">${POSTS.map(p => postCard(B, p)).join('')}</div>`
    : `<p class="say" style="max-width:60ch">The articles for this page have not been supplied yet.
         They will appear here as soon as the texts are provided.</p>
       <p style="margin-top:1.8rem"><a class="btn btn--l" href="${pageHref(B, 1)}">Back to the latest articles</a></p>`;

  return `${pageHead(cur)}
<section>
  <div class="shell">
    ${body}
    ${pagination(B, cur)}
  </div>
</section>

<section style="padding-top:0">
  <div class="shell">
    <div class="lead"><div><p class="tiny tiny--b" style="margin-bottom:.8rem">Ready when you are</p>
      <h2 class="d2">Read enough? Come and see it.</h2></div></div>
    <p style="margin-top:1.8rem;display:flex;gap:.8rem;flex-wrap:wrap">
      <a class="btn btn--l" href="${B}journeys/index.html">Explore our journeys</a>
      <a class="btn btn--o" href="${B}book/index.html">Plan my trip</a></p>
  </div>
</section>`;
}

/* ── page d'article ──────────────────────────────────────────────────
   Seul le contenu fourni est affiché : titre, date, catégorie, extrait.
   Le corps de l'article n'a pas été fourni — il n'est donc pas inventé. */
function postPage(B, p, i) {
  const prev = POSTS[i - 1], next = POSTS[i + 1];
  return `
<section class="hour sun" style="padding-top:clamp(8rem,15vw,11rem);padding-bottom:clamp(1.4rem,3vw,2.6rem)">
  <div class="in">
    <p class="tiny tiny--b">${CAT} — ${p.date}</p>
    <h1 class="d1" style="margin-top:1rem;max-width:20ch">${esc(p.title)}</h1>
    <p class="say" style="margin-top:1.4rem;max-width:62ch">${esc(p.excerpt)}</p>
  </div>
</section>

<section>
  <div class="shell" style="max-width:1100px">
    <img style="width:100%;display:block;aspect-ratio:16/9;object-fit:cover" src="${placeholder(p.photo, '/' + photoFile(p))}"
         data-photo="${B}${photoFile(p)}" alt="Photo placeholder — ${esc(p.photo)}"
         loading="lazy" decoding="async">
    <p class="say" style="margin-top:2.2rem;max-width:60ch">The full text of this article has not
      been supplied yet. Ask us anything it would have covered — we answer within 24 hours.</p>
    <p style="margin-top:2.2rem;display:flex;gap:.8rem;flex-wrap:wrap">
      <a class="btn btn--l" href="${B}contact/index.html">Ask us directly</a>
      <a class="btn btn--o" href="${B}blog/index.html">All articles</a></p>

    <div style="display:flex;flex-wrap:wrap;gap:.8rem;justify-content:space-between;
                margin-top:clamp(2.8rem,6vw,4.5rem);border-top:1px solid var(--line);padding-top:1.8rem">
      ${prev ? `<a class="btn btn--o btn--sm" href="${B}blog/${prev.slug}/index.html">← ${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a class="btn btn--o btn--sm" href="${B}blog/${next.slug}/index.html">${esc(next.title)} →</a>` : '<span></span>'}
    </div>
  </div>
</section>`;
}

/* ── écriture ────────────────────────────────────────────────────────── */
function build() {
  write('blog/index.html', shell({
    base: '../', canon: 'blog/index.html',
    title: `${PAGE_TITLE} | Mauritania Horizons`,
    desc: PAGE_DESC,
    jsonld: `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Blog', name: PAGE_TITLE,
      description: PAGE_DESC, url: 'https://mauritaniahorizons.com/blog/index.html',
      blogPost: POSTS.map(p => ({
        '@type': 'BlogPosting', headline: p.title, datePublished: p.iso,
        description: p.excerpt,
        url: `https://mauritaniahorizons.com/blog/${p.slug}/index.html`,
      })),
    })}</script>`,
    body: listPage('../', 1),
  }));

  for (let n = 2; n <= PAGES; n++) {
    write(`blog/page/${n}/index.html`, shell({
      base: '../../../', canon: `blog/page/${n}/index.html`,
      title: `${PAGE_TITLE} — page ${n} | Mauritania Horizons`,
      desc: PAGE_DESC,
      body: listPage('../../../', n),
    }));
  }

  POSTS.forEach((p, i) => {
    write(`blog/${p.slug}/index.html`, shell({
      base: '../../', canon: `blog/${p.slug}/index.html`,
      title: `${p.title} | Mauritania Horizons`,
      desc: p.excerpt,
      body: postPage('../../', p, i),
    }));
  });
}

module.exports = { build, POSTS, PAGES, PAGE_TITLE, PAGE_DESC };

if (require.main === module) build();
