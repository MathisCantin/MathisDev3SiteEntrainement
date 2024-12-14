# Documentation du site d'entrainement

## Description sommaire de l'application
L'application permet aux utilisateurs de :

Créer et consulter leurs entraînements personnels.
Consulter une liste d'entraînements publics partagés par d'autres utilisateurs.
Cette plateforme vise à suivre ses entraînements physiques pour les amateurs et les professionnels.

## Installation du site sur un poste local

### Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :
- **Node.js** version 16.6.0 ou supérieure (vous pouvez télécharger Node.js ici : https://nodejs.org/)
- **L'api** Assurez vous d'avoir installer l'api avant (vous pouvez suivre les étapes ici : https://github.com/MathisCantin/MathisDev3APi)

### Étapes d'installation

### Clonez le dépôt Git
```bash
git clone https://github.com/votre-utilisateur/votre-repository.git
cd votre-repository
```

### Installez les dépendances
npm install

### Modifiez le fichier api.ts et remplacez l'URL de l'API par celle que vous utilisez
```/serives/api.ts
const API_URL = 'Url'; 
```

### Démarrez le site
npm run dev

### Url du site en ligne: https://site-entrainements.netlify.app/
