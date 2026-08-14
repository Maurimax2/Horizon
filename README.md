# Mauritania Horizons — site

Site statique : HTML, CSS et JavaScript natifs. Aucun framework, aucune
dépendance à un serveur applicatif.

## Ouvrir

```
python3 -m http.server 8777      # puis http://localhost:8777
```

Ouvrir `index.html` directement fonctionne aussi : en `file://`, la feuille
`assets/css/fonts-inline.css` (fontes en base64) prend le relais, Chrome
refusant les `@font-face` vers un fichier voisin.

## Direction artistique — « la journée »

La page d'accueil traverse une journée dans le désert : **05:40** l'aube froide,
**13:00** le plein soleil, **18:50** le passage du train, **23:15** la nuit
étoilée. Une horloge fixe suit la descente. La vente n'arrive qu'après.

- Instrument Serif pour les titres, Space Grotesk pour le texte, Space Mono
  pour les repères et les étiquettes
- Fond nuit `#0B0A09`, plein soleil `#E8D3AE`, sable `#F0C078` (logo),
  bleu océan `#0078A8` (logo)
- Ciel étoilé généré au chargement sur les sections de nuit

## Pages

```
index.html                      Accueil — la journée
journeys/index.html             Les six circuits
journeys/<slug>.html            Une fiche par circuit (itinéraire, inclus, FAQ)
book/index.html                 Réservation en 5 étapes → WhatsApp + e-mail
reviews/index.html              Avis TripAdvisor et témoignages
guide/index.html                Guide pratique (visa, saison, sécurité, bagages)
services/index.html             Location de véhicules, visa, tournage
about/index.html                À propos
contact/index.html              Contact
```

## Génération

Les pages sont **générées** : ne pas les éditer à la main, elles sont écrasées.

```
node tools/build-site.js     # écrit les 14 pages (données dans build-site.js)
node tools/build-images.js   # source/photos/* → assets/img/* en WebP 480/900/natif
node tools/build-fonts.js    # fontes → fonts-inline.css (pour file://)
```

Les textes et les données des circuits vivent dans `tools/build-site.js`
(`JOURNEYS`, `INCLUDED`, `EXCLUDED`, `FAQ`, `REVIEWS`). La coquille commune —
en-tête, menu, pied de page — est la fonction `shell()`.

## Réservation

`assets/js/booking.js` — cinq étapes : circuit, dates, voyageurs, coordonnées,
récapitulatif. Validation à chaque étape, état conservé dans `sessionStorage`
(on peut recharger sans tout ressaisir), barre de progression. À l'envoi, un
message WhatsApp pré-rempli est ouvert vers `wa.me/22246656594`, avec un lien
`mailto:` et un bouton « copier » en secours. **Aucun backend.**

Un lien `book/index.html?journey=<slug>` présélectionne le circuit — c'est ce
qu'utilise le bouton « Book this journey » de chaque fiche.

## Avant mise en ligne

Voir `source/README.md`, `source/site-content.md` et `source/reviews.md` :

- Le hibou Tripadvisor est un dessin provisoire — le remplacer par l'asset
  officiel de tripadvisor.com/brand-resources
- Les quatre témoignages du site sont des résumés : récupérer les textes intégraux
- Les photos font 1170 px de large (exports Instagram) — demander les originaux
  pleine résolution pour les héros plein écran
- Droits à confirmer sur les photos du train du fer (crédit `@zoefortuna`)
- Confirmer ce que recouvrent les prix 149 / 200 / 300 $

## Mise en ligne

### Aperçu sur GitHub Pages

**À faire une fois, à la main** (le jeton d'Actions n'en a pas le droit) :
`Settings` → `Pages` → *Build and deployment* → **Source : GitHub Actions**.

Ensuite chaque push redéploie automatiquement via
`.github/workflows/deploy.yml`. L'adresse sera :

```
https://maurimax2.github.io/Horizon/
```

Tous les chemins du site sont relatifs, il fonctionne donc aussi bien
depuis un sous-dossier que depuis la racine d'un domaine.

### Sur l'hébergement de mauritaniahorizons.com

Le site est constitué de fichiers statiques : il suffit de déposer le
contenu à la racine du domaine, par FTP ou par le gestionnaire de fichiers
de l'hébergeur. Ce qu'il faut envoyer :

```
index.html  404.html  robots.txt  sitemap.xml
assets/  journeys/  book/  reviews/  guide/  services/  about/  contact/
source/brand/logo-brand.png
```

Inutile d'envoyer `node_modules/`, `tools/` ni `source/photos/` — ce sont
les sources de travail, pas le site servi. Le workflow assemble exactement
ce paquet dans son étape « Assemble the bundle ».

Aucune base de données, aucun langage serveur, aucune variable
d'environnement : le formulaire de réservation passe par WhatsApp et
`mailto:`.
