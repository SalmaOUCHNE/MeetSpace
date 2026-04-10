# Smart Meeting Room Reservation System - Frontend

## Description

Le frontend de Smart Meeting Room Reservation System est une application web développée avec React et TypeScript.

Il permet aux utilisateurs d’interagir avec le système de réservation : consulter les salles, vérifier les disponibilités et effectuer des réservations via une interface simple, intuitive et responsive.

---

## Technologies utilisées

* React.js
* TypeScript
* Tailwind CSS
* Axios
* React Router

---

## Installation et exécution

### 1. Cloner le projet

```bash
git clone https://github.com/SalmaOUCHNE/smart-room-booker.git
cd smart-room-booker/frontend
```

---

### 2. Installer les dépendances

```bash
npm install
```

---

### 3. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur :
http://localhost:5173

---

## Authentification

* Connexion via email et mot de passe
* Utilisation de JWT pour sécuriser les échanges
* Gestion des accès حسب rôle utilisateur

---

## Fonctionnalités principales

* Inscription et connexion
* Affichage des salles
* Recherche des salles disponibles
* Réservation de salles
* Gestion des réservations utilisateur
* Interface responsive

---

## Communication avec le Backend

Le frontend communique avec le backend via API REST.

Base URL :
http://localhost:8080/api

Exemple :

```javascript
axios.get("/rooms");
```

---

## Structure du projet

```bash
frontend/
│── src/
│   │── components/
│   │── pages/
│   │── services/
│   │── App.tsx
│── package.json
│── vite.config.ts
```

---

## Améliorations futures

* Notifications en temps réel
* Gestion avancée des erreurs
* Mode sombre
* Dashboard avec statistiques

---

## Auteur

Salma Ouchne
Aicha Zeidane
---

## Licence

Projet open-source à usage éducatif.

