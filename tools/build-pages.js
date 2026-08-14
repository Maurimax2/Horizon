#!/usr/bin/env node
/** Assemble et écrit toutes les pages. Lancé par tools/build-site.js. */
const S = require('./build-site.js');
const { JOURNEYS, INCLUDED, EXCLUDED, FAQ, REVIEWS, SITE_QUOTES,
  shell, write, heroImg, money, home, journeysIndex, journeyPage, PHONE, MAIL } = S;

const LD = (o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`;

const ORG = {
  '@context': 'https://schema.org', '@type': 'TravelAgency', '@id': 'https://mauritaniahorizons.com/#org',
  name: 'Mauritania Horizons',
  description: 'Mauritanian travel agency specialising in Sahara expeditions, ancient cities, the Iron Ore Train and the Atlantic coast.',
  url: 'https://mauritaniahorizons.com/', foundingDate: '2023',
  telephone: '+222-46-65-65-94', email: MAIL,
  address: { '@type': 'PostalAddress', streetAddress: 'ZRC N°334, Tevragh Zeina', addressLocality: 'Nouakchott', addressCountry: 'MR' },
  areaServed: { '@type': 'Country', name: 'Mauritania' }, knowsLanguage: ['en', 'fr', 'ar'],
};

/* ═════════════════════════════════════════════════════ RÉSERVATION ═══ */
function bookPage(B) {
  const opts = JOURNEYS.map(j => `
      <label class="opt">
        <input type="radio" name="journey" value="${j.slug}">
        <span><strong>${j.title}</strong><em>${j.days} day${j.days > 1 ? 's' : ''} · ${j.line.split(' · ').slice(0, 2).join(' · ')} · min. ${j.min}</em></span>
        <span class="pr">${money(j)}</span>
      </label>`).join('');

  return `
<section style="padding-top:clamp(6rem,12vw,9rem)">
  <div class="shell">
    <div class="book-hd" style="max-width:60ch">
      <p class="tiny tiny--b">Plan your journey</p>
      <h1 class="d2" style="margin-top:1rem">Tell us the shape of it.</h1>
      <p class="say" style="margin-top:1.2rem">Five short steps. Nothing is charged and nothing is
        committed — at the end you get a summary, and it goes straight to our team on WhatsApp or
        by email. We answer within 24 hours.</p>
    </div>

    <form id="booking" style="margin-top:clamp(2.5rem,5vw,4rem);max-width:820px" novalidate>
      <div class="steps">
        <span class="on">01 — Journey</span><span>02 — Dates</span><span>03 — Travellers</span>
        <span>04 — You</span><span>05 — Summary</span><span>Sent</span>
      </div>
      <div class="bar"><i></i></div>

      <!-- 1 ------------------------------------------------------------ -->
      <div class="pane on">
        <h2 class="d3">Which journey?</h2>
        <p class="say" style="margin:.9rem 0 1.7rem">Not sure yet? Pick the closest one — we adjust
          everything afterwards.</p>
        <div class="opts">${opts}
          <label class="opt">
            <input type="radio" name="journey" value="custom">
            <span><strong>Something else entirely</strong><em>Custom itinerary — you tell us</em></span>
            <span class="pr">On request</span>
          </label>
        </div>
        <div class="msg" style="font-family:var(--mono);font-size:.6rem;letter-spacing:.1em;
          color:#E2725B;text-transform:uppercase;margin-top:.8rem"></div>
      </div>

      <!-- 2 ------------------------------------------------------------ -->
      <div class="pane">
        <h2 class="d3">When?</h2>
        <p class="say" style="margin:.9rem 0 1.7rem">Best season is October to March. If your dates
          are not fixed, give us the arrival you have in mind and leave the rest.</p>
        <div class="grid2">
          <div class="field"><label for="ar">Arrival in Nouakchott</label>
            <input type="date" id="ar" name="arrival"><span class="msg"></span></div>
          <div class="field"><label for="de">Departure (optional)</label>
            <input type="date" id="de" name="departure"><span class="msg"></span></div>
        </div>
      </div>

      <!-- 3 ------------------------------------------------------------ -->
      <div class="pane">
        <h2 class="d3">How many of you?</h2>
        <p class="say" style="margin:.9rem 0 1.7rem">Most journeys run from three travellers.
          Fewer than that, ask us anyway — private departures are possible.</p>
        <div class="grid2">
          <div class="field"><label>Adults</label>
            <div class="count" data-min="1" data-max="16">
              <button type="button" data-step="-1" aria-label="One fewer adult">−</button>
              <output>2</output>
              <button type="button" data-step="1" aria-label="One more adult">+</button>
              <input type="hidden" name="adults" value="2">
            </div></div>
          <div class="field"><label>Children</label>
            <div class="count" data-min="0" data-max="10">
              <button type="button" data-step="-1" aria-label="One fewer child">−</button>
              <output>0</output>
              <button type="button" data-step="1" aria-label="One more child">+</button>
              <input type="hidden" name="children" value="0">
            </div></div>
        </div>
      </div>

      <!-- 4 ------------------------------------------------------------ -->
      <div class="pane">
        <h2 class="d3">Where do we reach you?</h2>
        <p class="say" style="margin:.9rem 0 1.7rem">We reply by email, and on WhatsApp if you
          give us a number.</p>
        <div class="grid2">
          <div class="field"><label for="nm">Full name</label>
            <input type="text" id="nm" name="name" autocomplete="name"><span class="msg"></span></div>
          <div class="field"><label for="em">Email</label>
            <input type="email" id="em" name="email" autocomplete="email"><span class="msg"></span></div>
          <div class="field"><label for="ph">Phone / WhatsApp (optional)</label>
            <input type="tel" id="ph" name="phone" autocomplete="tel"><span class="msg"></span></div>
          <div class="field"><label for="co">Country</label>
            <input type="text" id="co" name="country" autocomplete="country-name"><span class="msg"></span></div>
        </div>
        <div class="field"><label for="ms">Anything we should know?</label>
          <textarea id="ms" name="message" placeholder="Photography trip, dietary needs, mobility, a date that can't move…"></textarea></div>
      </div>

      <!-- 5 ------------------------------------------------------------ -->
      <div class="pane">
        <h2 class="d3">Check it over.</h2>
        <p class="say" style="margin:.9rem 0 1.7rem">This is exactly what we receive.</p>
        <dl class="recap" data-recap></dl>
        <p class="tiny" style="margin-top:1.4rem">Sending opens WhatsApp with this summary already
          written. Nothing is charged at this stage.</p>
        <p style="margin-top:1rem;display:flex;gap:.7rem;flex-wrap:wrap">
          <button class="btn btn--o btn--sm" type="button" data-goto="0">Change journey</button>
          <button class="btn btn--o btn--sm" type="button" data-goto="1">Change dates</button>
          <button class="btn btn--o btn--sm" type="button" data-goto="3">Change details</button>
        </p>
      </div>

      <!-- 6 : confirmation --------------------------------------------- -->
      <div class="pane">
        <div class="ok">
          <div class="ok__i"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5"><path d="M4 12.5 9.5 18 20 7"/></svg></div>
          <h2 class="d3">Your request is ready.</h2>
          <p class="say" style="margin:1rem auto 0;max-width:44ch">WhatsApp should have opened in a
            new tab with everything filled in. If it didn't, use one of these.</p>
          <p style="margin-top:2rem;display:flex;gap:.7rem;flex-wrap:wrap;justify-content:center">
            <a class="btn btn--l" data-final-wa target="_blank" rel="noopener" href="#">Open WhatsApp</a>
            <a class="btn btn--o" data-final-mail href="#">Send by email instead</a>
            <button class="btn btn--o" type="button" data-copy>Copy the summary</button>
          </p>
          <p class="tiny" style="margin-top:2rem">We answer within 24 hours — usually much sooner.<br>
            ${PHONE} · ${MAIL}</p>
        </div>
      </div>

      <div class="nav-btns">
        <button class="btn btn--o" type="button" data-back>Back</button>
        <button class="btn btn--l" type="button" data-next>Continue</button>
        <button class="btn btn--s" type="submit" data-send hidden>Send my request</button>
      </div>
    </form>
  </div>
</section>

<section style="padding-top:0">
  <div class="shell">
    <hr class="line">
    <div class="two" style="margin-top:var(--sp)">
      <div><p class="tiny tiny--b" style="margin-bottom:.9rem">Rather just talk?</p>
        <h2 class="d3">Some things are faster said than typed.</h2>
        <p class="say" style="margin-top:1.1rem">Call or message us directly. Our team answers in
          English, French and Arabic.</p></div>
      <div style="display:flex;flex-wrap:wrap;gap:.8rem;align-items:flex-start">
        <a class="btn btn--l" data-wa="Hello Mauritania Horizons," href="#">
          <svg style="width:16px;height:16px"><use href="#wa"/></svg> WhatsApp</a>
        <a class="btn btn--o" href="tel:+22246656594">${PHONE}</a>
      </div>
    </div>
  </div>
</section>`;
}

/* ═══════════════════════════════════════════════════════════ AVIS ════ */
function reviewsPage(B) {
  const card = (r) => `
    <article class="rev rv">
      <div class="rev__h">
        <img class="rev__av" src="${B}assets/img/${r.av}-480.webp" alt="" loading="lazy" decoding="async">
        <div><div class="rev__nm">${r.name}</div><div class="rev__mt">${r.meta}</div></div>
      </div>
      <div class="dots" aria-label="5 out of 5"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="rev__t">${r.title}</div>
      <p class="rev__x">${r.text}</p>
      ${r.pics ? `<div class="rev__p">${r.pics.map(p => `<img src="${B}assets/img/${p}-480.webp" alt="" loading="lazy" decoding="async">`).join('')}</div>` : ''}
      <div class="rev__f"><span>${r.date}</span><span>Tripadvisor</span></div>
    </article>`;

  return `
<section class="hour veil-soft" style="min-height:62svh">
  ${heroImg('portrait-cheche-regard', 'A traveller in the Adrar')}
  <div class="in" style="display:flex;flex-direction:column;justify-content:flex-end;min-height:62svh">
    <p class="tiny">Tripadvisor</p>
    <h1 class="d1" style="margin-top:1rem">They went.</h1>
    <p class="say" style="margin-top:1.2rem">Every word on this page was written by someone who
      travelled with us. Nothing is edited, including the typos.</p>
  </div>
</section>

<div class="tick"><div class="tick__in" data-tick>
  <b>“desert camps, coastal retreats, cultural tours”<i>Ameme C · Tripadvisor</i></b>
  <b>“was a great trip, recommend it”<i>Bouye C · Nouakchott</i></b>
  <b>“authentic Mauritanian travel experiences”<i>Ameme C · Solo</i></b>
  <b>“the team of horizons agency did a great services”<i>Bouye C</i></b>
  <b>“nights under the stars I still think about”<i>Vironika · Poland</i></b>
  <b>“guides who clearly love this desert”<i>Hilario · Spain</i></b>
  <b>“landscapes I had no reference for”<i>Fabrice · France</i></b>
</div></div>

<section>
  <div class="shell">
    <div class="lead">
      <div><p class="tiny tiny--b" style="margin-bottom:.9rem">On Tripadvisor</p>
        <h2 class="d2">In their words.</h2></div>
      <div style="text-align:right">
        <a class="btn btn--o btn--sm" href="https://www.tripadvisor.com/" target="_blank" rel="noopener">
          Read on Tripadvisor</a>
        <div class="tiny" style="margin-top:.7rem">Latest review: 15 March 2026</div>
      </div>
    </div>
    <div class="cards" style="margin-top:2.2rem;align-items:start">
      ${REVIEWS.map(card).join('')}
    </div>
  </div>
</section>

<section class="night" style="padding-block:var(--sp)">
  <svg class="stars" aria-hidden="true"></svg>
  <div class="shell">
    <p class="tiny tiny--b" style="margin-bottom:.9rem">From our own guest book</p>
    <h2 class="d2 rv" style="max-width:20ch">What travellers wrote to us directly.</h2>
    <div class="cards cards--3" style="margin-top:2.4rem">
      ${SITE_QUOTES.map(([n, c, t], i) => `
      <div class="rv" data-d="${i % 3}" style="padding-top:1.2rem;border-top:1px solid var(--line)">
        <p class="d4" style="font-family:var(--serif)">${n}</p>
        <p class="tiny" style="margin-top:.35rem">${c}</p>
        <p class="say" style="margin-top:.9rem;font-size:.95rem">${t}</p>
      </div>`).join('')}
    </div>
    <p class="tiny" style="margin-top:2.4rem;max-width:74ch">Four travellers who left testimonials
      on our previous site. We are recovering their original wording — until then we summarise what
      they praised rather than put words in their mouths.</p>
  </div>
</section>

<section>
  <div class="shell">
    <div class="two" style="align-items:center">
      <div>
        <p class="tiny tiny--b" style="margin-bottom:.9rem">Travelled with us?</p>
        <h2 class="d2 rv">Tell the next person.</h2>
        <p class="say rv" data-d="1" style="margin-top:1.2rem">Reviews are how a small agency in
          Nouakchott reaches someone in Paris or Warsaw. If the trip was good, two minutes of your
          time is worth more to us than any advertising.</p>
      </div>
      <div class="rv" data-d="1" style="display:flex;flex-wrap:wrap;gap:.8rem">
        <a class="btn btn--l" href="https://www.tripadvisor.com/" target="_blank" rel="noopener">Leave a review</a>
        <a class="btn btn--o" data-wa="Hello Mauritania Horizons, I would like to share my feedback." href="#">Send us a note</a>
      </div>
    </div>
  </div>
</section>`;
}

/* ══════════════════════════════════════════════════════════ GUIDE ═══ */
function guidePage(B) {
  const S1 = [
    ['visa', 'Visa', 'A biometric visa is issued on arrival at Nouakchott international airport (Oumtounsy) and at land borders. The fee is <b>$55 USD</b>, paid on the spot. We prepare the file with you and meet you on arrival. Your passport should be valid for at least six months.'],
    ['season', 'When to go', 'October to March. Days are warm rather than punishing and the light is at its best; nights in the deep desert drop close to freezing. Outside that window the heat makes long piste days genuinely hard.'],
    ['safety', 'Safety', 'Travel insurance is mandatory on every circuit. We run our own vehicles and crews, our guides are from the regions we cross, and logistical assistance is available 24/7 for the whole of your stay. We follow international health recommendations and will advise you on vaccinations and hygiene before departure.'],
    ['pack', 'What to pack', 'Long covering clothing, walking shoes, high-factor sun protection, a head torch and a warm sleeping bag. For the iron ore train specifically: a chèche, goggles or wraparound sunglasses, a dust mask, a blanket, snacks — and clothes you accept will keep the ore dust permanently.'],
    ['culture', 'Culture', 'Mauritania is a Muslim country. Dress covered, ask before photographing people, and accept the tea — it is offered as time, not as a drink, and it comes in three rounds. Alcohol is not publicly available.'],
    ['money', 'Money', 'The currency is the ouguiya (MRU). Cards work in parts of Nouakchott and almost nowhere else — carry cash once you leave the capital.'],
    ['food', 'Food', 'Méchoui, thieboudienne and mafé are the dishes to ask for. On circuit, all meals and water are included outside Nouakchott and Nouadhibou.'],
  ];
  return `
<section class="hour veil-soft" style="min-height:60svh">
  ${heroImg('manuscrits-anciens', 'Ancient manuscripts in Chinguetti')}
  <div class="in" style="display:flex;flex-direction:column;justify-content:flex-end;min-height:60svh">
    <p class="tiny">Mauritania travel guide</p>
    <h1 class="d1" style="margin-top:1rem">Everything you'll ask us anyway.</h1>
  </div>
</section>
<section>
  <div class="shell" style="max-width:1100px">
    ${S1.map((s, i) => `
    <div id="${s[0]}" class="rv" style="padding:2.2rem 0;border-top:1px solid var(--line)">
      <div class="two" style="align-items:start;gap:1.5rem clamp(2rem,5vw,4rem)">
        <div><p class="tiny tiny--b">${String(i + 1).padStart(2, '0')}</p>
          <h2 class="d3" style="margin-top:.6rem">${s[1]}</h2></div>
        <p class="say" style="max-width:56ch">${s[2]}</p>
      </div>
    </div>`).join('')}
    <div class="faq" style="margin-top:3rem">
      <p class="tiny tiny--b" style="margin-bottom:1.2rem">Frequently asked</p>
      ${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}
    </div>
    <p style="margin-top:2.6rem"><a class="btn btn--l" href="${B}book/index.html">Plan a journey</a></p>
  </div>
</section>`;
}

/* ══════════════════════════════════════════════════════ SERVICES ════ */
function servicesPage(B) {
  const cars = [
    ['Toyota Corolla', 'Affaires & Ville', 'Business meetings in Nouakchott, urban travel, and the Nouakchott–Nouadhibou road.'],
    ['Toyota Hilux Double Cab', 'Incontournable Pistes', 'Field missions, mining, desert exploration, sand and off-road tracks. The workhorse of Mauritanian hire.'],
    ['Toyota Prado TXL', 'Luxe & Franchissement', 'Adrar circuits, expeditions and dune crossing, with comfort.'],
  ];
  return `
<section class="hour veil-soft" style="min-height:58svh">
  ${heroImg('portrait-cheche-noir', 'A 4×4 on the piste in the Adrar')}
  <div class="in" style="display:flex;flex-direction:column;justify-content:flex-end;min-height:58svh">
    <p class="tiny">Beyond the journeys</p>
    <h1 class="d1" style="margin-top:1rem">Vehicles, visas, film crews.</h1>
  </div>
</section>

<section id="cars">
  <div class="shell">
    <div class="lead"><div><p class="tiny tiny--b" style="margin-bottom:.8rem">01 — Car rental</p>
      <h2 class="d2">Prepared for the piste, not the brochure.</h2></div></div>
    <p class="say" style="margin-top:1.6rem;max-width:60ch">Private and professional transport for
      travellers, businesses, industrial projects, field missions and desert expeditions. Vehicles
      under five years old, new all-terrain tyres, reinforced air conditioning and a complete
      emergency kit.</p>
    <div class="cards cards--3" style="margin-top:2.4rem">
      ${cars.map(([n, c, u], i) => `
      <div class="rv" data-d="${i}" style="border-top:1px solid var(--line);padding-top:1.2rem">
        <p class="tiny tiny--b">${c}</p>
        <h3 class="d4" style="margin-top:.6rem">${n}</h3>
        <p class="say" style="margin-top:.7rem;font-size:.95rem">${u}</p>
      </div>`).join('')}
    </div>
    <div class="two" style="margin-top:3rem">
      <div><h3 class="d4">Self-drive or with a driver</h3>
        <p class="say" style="margin-top:.8rem">Self-drive is possible. For difficult off-road and
          desert work we strongly recommend the chauffeur option — our drivers navigate the Sahara,
          know sand and fech-fech, and can carry out emergency mechanical work in the field.</p></div>
      <div><h3 class="d4">Assistance and cover</h3>
        <p class="say" style="margin-top:.8rem">4×4 rental includes 24/7 assistance and a partner
          network in Atar, Chinguetti, Zouérate and Nouadhibou for vehicle replacement and technical
          intervention. Short-term Nouakchott rentals include generous mileage and standard
          comprehensive insurance. Rates fall with duration; long rentals are quoted individually.</p></div>
    </div>
    <p class="tiny" style="margin-top:1.8rem">Reserve by WhatsApp or email · Payment by bank transfer,
      card, or cash on site</p>
    <p style="margin-top:1.4rem"><a class="btn btn--l" data-wa="Hello Mauritania Horizons, I would like to rent a vehicle." href="#">Request a vehicle</a></p>
  </div>
</section>

<section class="night" id="visa">
  <svg class="stars" aria-hidden="true"></svg>
  <div class="shell">
    <div class="two">
      <div><p class="tiny tiny--b" style="margin-bottom:.8rem">02 — Visa assistance</p>
        <h2 class="d2 rv">We handle the file.</h2>
        <p class="say rv" data-d="1" style="margin-top:1.2rem">A biometric visa is issued on arrival
          at Nouakchott international airport and at land borders — $55 USD, paid on the spot. We
          prepare the paperwork with you, advise on timing, and meet you at the airport.</p></div>
      <img class="r43 rv" data-d="1" src="${B}assets/img/vehicule-interieur-village-900.webp" alt="Arrival transfer" loading="lazy" decoding="async">
    </div>
  </div>
</section>

<section id="media">
  <div class="shell">
    <div class="two two--l">
      <img class="r43 rv" src="${B}assets/img/train-fer-wagon-minerai-900.webp" alt="Filming on the iron ore train" loading="lazy" decoding="async">
      <div><p class="tiny tiny--b" style="margin-bottom:.8rem">03 — Media production & filming</p>
        <h2 class="d2 rv">Fixing, permits, desert logistics.</h2>
        <p class="say rv" data-d="1" style="margin-top:1.2rem">Location scouting, filming
          authorisations, fixing and full desert logistics for photo and video crews — vehicles,
          power, camps, guides and site access. We work with filmmakers, photographers, NGOs,
          researchers, production companies and international organisations.</p>
        <p class="rv" data-d="2" style="margin-top:1.8rem"><a class="btn btn--o" data-wa="Hello Mauritania Horizons, I am planning a shoot in Mauritania." href="#">Talk to us about a shoot</a></p></div>
    </div>
  </div>
</section>

<section id="more" style="padding-top:0">
  <div class="shell">
    <hr class="line">
    <div style="margin-top:var(--sp)">
      <p class="tiny tiny--b" style="margin-bottom:.8rem">04 — Additional services</p>
      <h2 class="d2 rv">The rest of the chain.</h2>
      <p class="say rv" data-d="1" style="margin-top:1.2rem;max-width:56ch">Airport arrival
        assistance, transfers, accommodation, interpreter guides, camping equipment, catering and
        tailor-made extensions — the whole logistical chain, from the visa to the return flight.</p>
      <p class="rv" data-d="2" style="margin-top:2rem"><a class="btn btn--l" href="${B}contact/index.html">Ask for a quote</a></p>
    </div>
  </div>
</section>`;
}

/* ═════════════════════════════════════════════════════════ À PROPOS ══ */
function aboutPage(B) {
  const vals = [
    ['Authenticity', 'Experiences that reflect the real essence of Mauritania, not a staged version of it.'],
    ['Quality of service', 'Customer satisfaction is the priority, from the first message to the return flight.'],
    ['Respect & responsibility', 'For local cultures, local communities and the environment. Tourism that benefits the people it passes through.'],
    ['Security', 'Your safety is the first consideration on every itinerary we run.'],
  ];
  return `
<section class="hour veil-dawn" style="min-height:70svh">
  ${heroImg('portrait-boubou-bleu', 'A Mauritanian guide')}
  <div class="in" style="display:flex;flex-direction:column;justify-content:flex-end;min-height:70svh">
    <p class="tiny">About us</p>
    <h1 class="d1" style="margin-top:1rem">Local, since the beginning.</h1>
  </div>
</section>
<section>
  <div class="shell">
    <div class="two">
      <div>
        <h2 class="d2 rv">Founded in Nouakchott in 2023.</h2>
        <p class="say rv" data-d="1" style="margin-top:1.3rem">A Mauritanian tourism company,
          approved by the Mauritanian state, specialising in travel across the whole country. In a
          short time we have become a reference in Mauritanian tourism — through service, respect
          for local cultures, local expertise and journeys built around the person taking them.</p>
        <p class="say rv" data-d="2" style="margin-top:1rem">Our team includes people native to the
          regions we cross. They know the desert tracks, the wells, the Adrar, Banc d'Arguin and the
          communities along the way. We handle the whole logistical chain ourselves: visa assistance,
          airport arrival, 4×4s, drivers, guides, desert logistics, accommodation, camps, activities
          and food.</p>
      </div>
      <img class="r34 rv" data-d="1" src="${B}assets/img/bibliothecaire-manuscrits-900.webp" alt="" loading="lazy" decoding="async">
    </div>
  </div>
</section>
<section class="night">
  <svg class="stars" aria-hidden="true"></svg>
  <div class="shell">
    <p class="tiny tiny--b" style="margin-bottom:.9rem">What we hold to</p>
    <h2 class="d2 rv">Four things, consistently.</h2>
    <div class="cards" style="margin-top:2.4rem">
      ${vals.map(([t, p], i) => `<div class="rv" data-d="${i % 3}" style="border-top:1px solid var(--line);padding-top:1.2rem">
        <h3 class="d4">${t}</h3><p class="say" style="margin-top:.7rem;font-size:.95rem">${p}</p></div>`).join('')}
    </div>
  </div>
</section>
<section>
  <div class="shell">
    <div class="two">
      <div><p class="tiny tiny--b" style="margin-bottom:.8rem">Sustainable tourism</p>
        <h2 class="d3 rv">The money stays here.</h2>
        <p class="say rv" data-d="1" style="margin-top:1.1rem">We work directly with local people —
          guides, cooks, camel handlers — so that the economic benefit reaches the communities we
          travel through. The historic towns of Chinguetti, Ouadane and Tichitt depend on visitors
          arriving in a way that helps preserve them.</p></div>
      <img class="r43 rv" data-d="1" src="${B}assets/img/enfant-danse-sable-900.webp" alt="" loading="lazy" decoding="async">
    </div>
    <p style="margin-top:3rem"><a class="btn btn--l" href="${B}book/index.html">Travel with us</a></p>
  </div>
</section>`;
}

/* ═══════════════════════════════════════════════════════ CONTACT ════ */
function contactPage(B) {
  return `
<section style="padding-top:clamp(6rem,12vw,9rem)">
  <div class="shell">
    <div class="two">
      <div>
        <p class="tiny tiny--b">Contact</p>
        <h1 class="d2" style="margin-top:1rem">Talk to someone who has been there.</h1>
        <p class="say" style="margin-top:1.3rem">Whether you are a photographer chasing the light on
          the dunes of Inchiri, a family bringing children and wanting to be sure about safety, or a
          solo traveller who wants to cross the sand by camel — tell us, and we will tell you
          honestly whether and how it can be done.</p>
        <div style="margin-top:2.4rem;display:grid;gap:1.4rem">
          <div><p class="tiny tiny--b">Phone & WhatsApp</p>
            <p class="d4" style="margin-top:.4rem"><a href="tel:+22246656594">${PHONE}</a></p></div>
          <div><p class="tiny tiny--b">Email</p>
            <p class="d4" style="margin-top:.4rem"><a href="mailto:${MAIL}">${MAIL}</a></p>
            <p class="tiny" style="margin-top:.4rem">Partnerships: mome@mauritaniahorizons.com</p></div>
          <div><p class="tiny tiny--b">Office</p>
            <p class="say" style="margin-top:.4rem">ZRC N°334, Tevragh Zeina<br>Nouakchott, Mauritania</p></div>
          <div><p class="tiny tiny--b">Response time</p>
            <p class="say" style="margin-top:.4rem">Within 24 hours, in English, French or Arabic.</p></div>
        </div>
        <p style="margin-top:2.2rem;display:flex;gap:.7rem;flex-wrap:wrap">
          <a class="btn btn--l" data-wa="Hello Mauritania Horizons," href="#">
            <svg style="width:16px;height:16px"><use href="#wa"/></svg> WhatsApp us</a>
          <a class="btn btn--o" href="${B}book/index.html">Plan a journey</a></p>
      </div>
      <img class="r34" src="${B}assets/img/ouadane-ruines-panneau-900.webp" alt="Ouadane" loading="lazy" decoding="async">
    </div>
  </div>
</section>`;
}

/* ═══════════════════════════════════════════════════════ ÉCRITURE ═══ */
console.log('Génération du site :');

write('index.html', shell({
  base: './', clock: true, canon: '',
  title: 'Mauritania Horizons | The Sahara, unlike anywhere else',
  desc: 'Licensed Mauritanian expedition specialists since 2023. Six journeys through the Adrar, Chinguetti, Ouadane, the Richat Structure, Banc d\'Arguin and the Iron Ore Train.',
  jsonld: LD(ORG), body: home('./'),
}));

write('journeys/index.html', shell({
  base: '../', canon: 'journeys/index.html',
  title: 'Our journeys | Mauritania Horizons',
  desc: 'Six real itineraries across Mauritania, from one day in Nouakchott to a twelve-day expedition through the Adrar and the Atlantic coast.',
  body: journeysIndex('../'),
}));

JOURNEYS.forEach((j) => {
  write(`journeys/${j.slug}.html`, shell({
    base: '../', canon: `journeys/${j.slug}.html`,
    title: `${j.title} — ${j.days} day${j.days > 1 ? 's' : ''} | Mauritania Horizons`,
    desc: j.blurb.slice(0, 175),
    jsonld: LD({
      '@context': 'https://schema.org', '@type': 'TouristTrip', name: j.title,
      description: j.blurb, provider: { '@id': 'https://mauritaniahorizons.com/#org' },
      ...(j.itinerary ? { itinerary: { '@type': 'ItemList', numberOfItems: j.itinerary.length,
        itemListElement: j.itinerary.map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: d.t })) } } : {}),
    }),
    body: journeyPage('../', j),
  }));
});

write('book/index.html', shell({
  base: '../', canon: 'book/index.html',
  title: 'Plan your journey | Mauritania Horizons',
  desc: 'Five short steps to send us your dates, your group and your journey. No payment, no commitment — we reply within 24 hours.',
  body: bookPage('../'),
  extraJs: '\n<script src="../assets/js/booking.js" defer></script>',
}));

write('reviews/index.html', shell({
  base: '../', canon: 'reviews/index.html',
  title: 'Reviews | Mauritania Horizons',
  desc: 'Verified Tripadvisor reviews and traveller testimonials for Mauritania Horizons — quoted in full, unedited.',
  body: reviewsPage('../'),
}));

write('guide/index.html', shell({
  base: '../', canon: 'guide/index.html',
  title: 'Mauritania travel guide — visa, season, safety, packing | Mauritania Horizons',
  desc: 'Practical guidance for travelling in Mauritania: the $55 visa on arrival, the October to March season, safety, what to pack, culture and money.',
  jsonld: LD({ '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) }),
  body: guidePage('../'),
}));

write('services/index.html', shell({
  base: '../', canon: 'services/index.html',
  title: 'Car rental, visa assistance & film logistics | Mauritania Horizons',
  desc: 'Toyota Hilux, Prado and Corolla rental with or without a driver, visa assistance, media production support and full desert logistics in Mauritania.',
  body: servicesPage('../'),
}));

write('about/index.html', shell({
  base: '../', canon: 'about/index.html',
  title: 'About Mauritania Horizons | Local expedition specialists since 2023',
  desc: 'A Mauritanian tourism company approved by the state, founded in Nouakchott in 2023, running its own vehicles, guides and camps.',
  body: aboutPage('../'),
}));

write('contact/index.html', shell({
  base: '../', canon: 'contact/index.html',
  title: 'Contact | Mauritania Horizons',
  desc: 'Reach Mauritania Horizons in Nouakchott — phone, WhatsApp, email. We answer within 24 hours in English, French and Arabic.',
  body: contactPage('../'),
}));


/* ── sitemap, robots, 404 ─────────────────────────────────────────────── */
const ROOT = 'https://mauritaniahorizons.com/';
const URLS = ['', 'journeys/index.html', ...JOURNEYS.map(j => `journeys/${j.slug}.html`),
  'book/index.html', 'reviews/index.html', 'guide/index.html', 'services/index.html',
  'about/index.html', 'contact/index.html'];
const today = new Date().toISOString().slice(0, 10);
S.write('sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  URLS.map(u => `  <url><loc>${ROOT}${u}</loc><lastmod>${today}</lastmod>` +
    `<priority>${u === '' ? '1.0' : u.startsWith('journeys/') || u === 'book/index.html' ? '0.8' : '0.6'}</priority></url>`).join('\n') +
  '\n</urlset>\n');

S.write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${ROOT}sitemap.xml\n`);

S.write('404.html', shell({
  base: './', canon: '404.html',
  title: 'Page not found | Mauritania Horizons',
  desc: 'That page does not exist. Find our journeys, reviews and travel guide here.',
  body: `
<section style="padding-top:clamp(7rem,14vw,11rem);min-height:70svh">
  <div class="shell">
    <p class="tiny tiny--b">Error 404</p>
    <h1 class="d2" style="margin-top:1rem;max-width:18ch">You have gone off the piste.</h1>
    <p class="say" style="margin-top:1.3rem">That page does not exist. It happens out here.</p>
    <p style="margin-top:2.2rem;display:flex;gap:.7rem;flex-wrap:wrap">
      <a class="btn btn--l" href="./index.html">Back to the start</a>
      <a class="btn btn--o" href="./journeys/index.html">See the journeys</a>
      <a class="btn btn--o" href="./book/index.html">Plan a trip</a></p>
  </div>
</section>`,
}));

console.log('Terminé.');
