#!/usr/bin/env node
/* Génère assets/css/fonts-inline.css (fontes en base64).
   Chrome refuse les @font-face vers un fichier voisin en file:// ; cette
   feuille n'est chargée que dans ce cas. En HTTP, les .woff2 suffisent. */
const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'..','assets');
const b64=f=>fs.readFileSync(path.join(dir,'fonts',f)).toString('base64');
const face=(fam,file,w)=>`@font-face{font-family:'${fam}';src:url(data:font/woff2;base64,${b64(file)}) format('woff2');font-weight:${w};font-style:normal;font-display:swap}`;
const css='/* Généré par tools/build-fonts.js — NE PAS ÉDITER. */\n'+
  face('Fraunces','fraunces.woff2','300 900')+'\n'+face('Inter','inter.woff2','300 700')+'\n';
fs.writeFileSync(path.join(dir,'css','fonts-inline.css'),css);
console.log('fonts-inline.css '+(css.length/1024).toFixed(0)+' kB');
