# Données MAJIC

[![npm version](https://badge.fury.io/js/%40etalab%2Fmajic.svg)](https://badge.fury.io/js/%40etalab%2Fmajic)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Scripts permettant d'extraire les données MAJIC au format NDJSON.

## Prérequis

* [Node.js](https://nodejs.org) >= 8
* Pour France entière : environ 20 Go d'espace disponible (5 Go pour les fichiers sources, 10 Go pour l'espace de travail, 5 Go pour les données résultantes)

## Installation

```bash
npm install @etalab/majic -g
```

## Récupération des fichiers MAJIC

⚠️ Les fichiers MAJIC contiennent des données personnelles et des informations sous secret fiscal.
La manipulation de ces données doit faire l'objet d'une déclaration [CNIL](https://www.cnil.fr/).

Les données sources doivent être récupérées auprès des services de la DGFiP, ou de ses antennes locales.

## Production des données

Actuellement la production des fichiers se déroule en 2 étapes, via 2 commandes.

### Préparation des fichiers MAJIC

Tout d'abord la commande `prepare` explore le dossier contenant les archives MAJIC par direction, les décompresse dans le dossier de destination et fusionne les données par département.

Pour France entière l'opération ne prend que quelques minutes sur une machine moyenne.

```bash
majic-prepare sources/ destination/
```

* `sources/` : dossier contenant les archives MAJIC telles que fournies par l'administration
* `destination/` : dossier qui contiendra les données rangées par département

### Extraction des données MAJIC et production des fichiers NDJSON

Les fichiers générés par la commande `majic-prepare` sont compressés (gzip).

```bash
cat path/to/departements/XX/BATI.gz | majic2json > path/to/XX.ndjson
```

## Utilisation programmatique

```js
const {createReadStream} = require('fs')
const {parse} = require('@etalab/majic')

createReadStream('/path/to/BATI.gz')
  .pipe(parse())
  .on('data', local => {
    // Traitement
  })
  .on('end', () => {
    // Terminé
  })
```

## Licence

MIT
