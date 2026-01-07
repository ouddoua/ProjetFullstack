# Plateforme de réservation de restaurants

## Description
Cette plateforme permet aux utilisateurs de rechercher des restaurants,
de visualiser le plan 2D des établissements et de réserver une table en ligne.
Les restaurateurs peuvent gérer leurs restaurants et valider les réservations.

## Fonctionnalités
- Recherche de restaurants par ville, cuisine et nom
- Visualisation du plan 2D du restaurant
- Sélection et réservation d’une table
- Validation des réservations par le restaurateur
- Authentification (inscription / connexion)


## Technologies utilisées
- Backend : Node.js, Express.js
- Base de données : MongoDB, Mongoose
- Frontend : React / HTML-CSS-JS
- Authentification : JWT, MiddleWare
- Outils : Git, GitHub, Figma

## Architecture
Application web basée sur une architecture client-serveur :
- Frontend communique avec le backend via une API REST
- Backend gère la logique métier et l’accès à la base MongoDB

## Installation
git clone https://github.com/ouddoua/ProjetFullstack.git
npm install
cd Client
npm install
cd..
npm run dev 

### Utilisation

- Créer un compte client
- Se connecter
- Rechercher un restaurant
- Choisir une table et effectuer une réservation

- Créer un compte restaurateur
- Se connecter
- Remplir les données d'un restaurant et sauvegarder
- Mettre les tables sur le plan et sauvegarder
- Voir les réservations
- Valider ou annuler les réservations

## Équipe
- Mariem Khedhira
- Aya Ouddou

## Améliorations futures
- Notifications en temps réel
- Amélioration du design UI/UX
- Paiement en ligne
- Application mobile
