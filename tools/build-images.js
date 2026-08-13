#!/usr/bin/env node
/**
 * Pipeline images : source/photos/*  →  assets/img/*  en WebP responsive.
 *
 * sharp n'est pas installable dans cet environnement ; la conversion passe
 * donc par le moteur de rendu de Chromium (canvas + toDataURL('image/webp')),
 * qui produit exactement le même format.
 *
 *   node tools/build-images.js
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'source', 'photos');
const OUT = path.join(__dirname, '..', 'assets', 'img');
const WIDTHS = [480, 900, 1600];
const QUALITY = 0.82;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const files = fs.readdirSync(SRC).filter((f) => /\.(jpg|jpeg|webp|png)$/i.test(f));
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('about:blank');
  const manifest = {};
  let out_bytes = 0, in_bytes = 0;

  for (const f of files) {
    const base = f.replace(/\.[^.]+$/, '');
    const buf = fs.readFileSync(path.join(SRC, f));
    in_bytes += buf.length;
    const mime = /\.webp$/i.test(f) ? 'webp' : /\.png$/i.test(f) ? 'png' : 'jpeg';
    const uri = 'data:image/' + mime + ';base64,' + buf.toString('base64');

    const res = await p.evaluate(async ({ uri, widths, q }) => {
      const im = new Image();
      im.src = uri;
      await im.decode();
      const o = { w: im.naturalWidth, h: im.naturalHeight, v: {} };
      // la largeur native est toujours produite, sous le nom « full » :
      // c'est elle que servent les héros plein écran.
      for (const w of widths.concat([im.naturalWidth])) {
        if (w > im.naturalWidth * 1.02) continue; // jamais d'agrandissement
        const h = Math.round(im.naturalHeight * (w / im.naturalWidth));
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const x = c.getContext('2d');
        x.imageSmoothingQuality = 'high';
        x.drawImage(im, 0, 0, w, h);
        o.v[w] = c.toDataURL('image/webp', q);
      }
      return o;
    }, { uri, widths: WIDTHS, q: QUALITY });

    manifest[base] = { w: res.w, h: res.h, widths: [] };
    for (const w of Object.keys(res.v)) {
      const bin = Buffer.from(res.v[w].split(',')[1], 'base64');
      fs.writeFileSync(path.join(OUT, `${base}-${Number(w)===res.w?'full':w}.webp`), bin);
      manifest[base].widths.push(Number(w));
      out_bytes += bin.length;
    }
    manifest[base].widths.sort((a, c) => a - c);
    process.stdout.write(`  ${base}  ${res.w}x${res.h} -> ${manifest[base].widths.join(', ')}\n`);
  }

  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
  await b.close();
  console.log(`\n${files.length} images | source ${(in_bytes / 1048576).toFixed(1)} Mo -> sortie ${(out_bytes / 1048576).toFixed(1)} Mo`);
})();
