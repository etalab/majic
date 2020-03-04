# Données MAJIC

[![npm version](https://badge.fury.io/js/%40etalab%2Fmajic.svg)](https://badge.fury.io/js/%40etalab%2Fmajic)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Scripts permettant d'extraire les données MAJIC au format NDJSON.

## Prérequis

* [Node.js](https://nodejs.org) >= 10
* Pour France entière : environ 20 Go d'espace disponible (5 Go pour les fichiers sources, 10 Go pour l'espace de travail, 5 Go pour les données résultantes)

## Installation

```bash
yarn
```

## Récupération des fichiers MAJIC

⚠️ Les fichiers MAJIC contiennent des données personnelles et des informations sous secret fiscal.
La manipulation de ces données doit faire l'objet d'une déclaration [CNIL](https://www.cnil.fr/).

Les données sources doivent être récupérées auprès des services de la DGFiP, ou de ses antennes locales.

## Production des données

Actuellement la production des fichiers se déroule en 2 étapes, via 2 commandes.

### Décompression des archives auto-extractibles (le cas échéant)

Les fichiers MAJIC sont fréquemment mis à disposition sous forme d’archives auto-extractibles (sous Windows).

Vous devez décompresser ces archives et placer tous les fichiers résultants dans un répertoire unique, par exemple un dossier `./data`.

Sous Mac ou sous Linux, vous pouvez utiliser les outils `find` et `unar`. Par exemple :

```bash
find /path/to/*.exe -exec unar -D -f -o data/ {} \;
```

Les fichiers résultants ont l’extension `zip` ou `gz`.

### Import des fichiers MAJIC

Tout d'abord la commande `import-data` explore le dossier contenant les fichiers MAJIC par direction, et les charge dans la base SQLite `majic.sqlite`, par code commune et code fichier (`BATI`, `NBAT`, `PROP`, `PDLL`, `LLOT`).

Pour France entière l'opération ne prend que quelques minutes sur une machine moyenne.

```bash
yarn import-data
```

## Utilisation

La variable d'environnement `MAJIC_PATH` doit être renseignée de manière à pointer vers le fichier généré à l'étape précédente.

### Accéder aux données d'une commune

```js
const {getCommuneData} = require('@etalab/majic')

// Données brutes
await getCommuneData('54084')

// Données simplifiées
await getCommuneData('54084', {profile: 'simple})
```

## Licence

MIT
