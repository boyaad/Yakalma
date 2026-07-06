# Yakalma 🍽️

Marketplace web de plats faits maison permettant de mettre en relation des cuisiniers locaux et des consommateurs.

## 📌 Présentation

Yakalma est une plateforme web développée dans le cadre d'un projet de fin de cycle.

L'application permet :

- Aux vendeurs de publier leurs plats faits maison
- Aux acheteurs de rechercher et commander des plats
- De gérer les avis et notations
- De favoriser la visibilité des cuisiniers locaux

---

# 🚀 Stack Technique

| Domaine           | Technologie   |
| ----------------- | ------------- |
| Frontend          | React + Vite  |
| Backend           | Supabase      |
| Base de données   | PostgreSQL    |
| Authentification  | Supabase Auth |
| Hébergement       | Vercel        |
| Gestion de projet | Trello        |
| Versionning       | Git & GitHub  |

---

# 📂 Structure du projet

```text
src/
├── assets/
├── components/
├── pages/
├── layouts/
├── routes/
├── hooks/
├── context/
├── services/
├── utils/
├── styles/
└── config/
```

---

# ⚙️ Installation du projet

## 1. Cloner le dépôt

```bash
git clone https://github.com/boyaad/Yakalma.git
cd Yakalma
```

## 2. Installer les dépendances

```bash
npm install
```

## 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 4. Lancer le projet

```bash
npm run dev
```

Le projet sera accessible sur :

```text
http://localhost:5173
```

---

# 🌿 Organisation Git

## Branches principales

```text
main
develop
```

## Branches de fonctionnalités

```text
feature/core
feature/auth
feature/plats
feature/orders
feature/ui
```

---

# 🔄 Workflow Git

Chaque développeur travaille uniquement sur sa branche.

Avant de commencer :

```bash
git checkout votre-branche
git pull origin develop
```

Exemple :

```bash
git checkout feature/auth
git pull origin develop
```

Une fois le travail terminé :

```bash
git add .
git commit -m "feat(auth): description"
git push origin feature/auth
```

Puis créer une Pull Request vers :

```text
develop
```

---

# 📝 Convention des commits

## Nouvelle fonctionnalité

```bash
feat(auth): ajout connexion utilisateur
```

## Correction de bug

```bash
fix(ui): correction navbar responsive
```

## Documentation

```bash
docs(readme): mise à jour installation
```

## Refactoring

```bash
refactor(plats): optimisation du service plats
```

## Configuration

```bash
chore(core): configuration Supabase
```

---

# 👥 Répartition des modules

## Abdoul Aziz Diallo

Chef de projet & Architecte logiciel

- Architecture React
- Intégration Supabase
- Gestion globale
- Déploiement
- Intégration finale

## Cheikhou Mamou Ciss

- Authentification
- Gestion des profils utilisateurs

## Famata Diallo

- Gestion des plats
- Catégories
- Upload des images

## Ibrahima Diagne

- Commandes
- Avis et notations
- Notifications

## Joseph Junior Diop Sagna

- UI/UX
- Intégration Figma
- Responsive Design

---

# 📋 Règles du projet

- Ne jamais travailler directement sur `main`.
- Ne jamais développer directement sur `develop`.
- Toujours travailler sur sa branche dédiée.
- Faire des commits réguliers.
- Tester avant chaque Push.
- Utiliser des messages de commit clairs.
- Passer par une Pull Request avant toute fusion.

---

# 📄 Licence

Projet académique réalisé dans le cadre du projet de fin de cycle.

---

# 🛠️ Commandes Git utiles

## Vérifier la branche actuelle

```bash
git branch
```

---

## Voir l'état du projet

```bash
git status
```

---

## Récupérer les dernières modifications

```bash
git pull origin develop
```

---

## Changer de branche

```bash
git checkout nom-branche
```

Exemple :

```bash
git checkout feature/auth
```

---

## Ajouter les fichiers modifiés

```bash
git add .
```

---

## Créer un commit

```bash
git commit -m "feat(auth): ajout formulaire de connexion"
```

---

## Envoyer les modifications sur GitHub

```bash
git push origin nom-branche
```

Exemple :

```bash
git push origin feature/auth
```

---

## Fusionner les dernières modifications de develop

Avant de commencer une nouvelle tâche :

```bash
git checkout votre-branche
git pull origin develop
```

---

## Résoudre un conflit Git

Après une fusion, si Git signale un conflit :

1. Ouvrir le fichier concerné.
2. Rechercher les marqueurs :

```text

```

3. Conserver la bonne version du code.
4. Supprimer les marqueurs.
5. Sauvegarder le fichier.

Puis :

```bash
git add .
git commit -m "fix(git): résolution conflit"
```

---

## Annuler les modifications non enregistrées

```bash
git restore .
```

⚠️ Cette commande supprime toutes les modifications locales non sauvegardées.

---

## Voir l'historique des commits

```bash
git log --oneline
```

---

## Mettre à jour toutes les branches distantes

```bash
git fetch --all
```

---

## Workflow recommandé

```text
1. git checkout votre-branche
2. git pull origin develop
3. Développement
4. git add .
5. git commit -m "type(module): description"
6. git push origin votre-branche
7. Création d'une Pull Request vers develop
```
