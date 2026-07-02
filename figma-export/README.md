# Inventaire Figma - Yakalma

Genere le 2026-07-01 depuis http://127.0.0.1:5174.

## Captures realisees

| Ecran | Route | Desktop | Mobile | Note |
|---|---|---|---|---|
| Accueil | `/` | `desktop-1440/01-home-desktop.png` | `mobile-390/01-home-mobile.png` |  |
| Catalogue plats | `/plats` | `desktop-1440/02-catalogue-plats-desktop.png` | `mobile-390/02-catalogue-plats-mobile.png` |  |
| Detail plat | `/plats/fallback-1` | `desktop-1440/03-detail-plat-desktop.png` | `mobile-390/03-detail-plat-mobile.png` |  |
| Connexion | `/login` | `desktop-1440/04-login-desktop.png` | `mobile-390/04-login-mobile.png` |  |
| Inscription | `/register` | `desktop-1440/05-register-desktop.png` | `mobile-390/05-register-mobile.png` |  |
| Mot de passe oublie | `/forgot-password` | `desktop-1440/06-forgot-password-desktop.png` | `mobile-390/06-forgot-password-mobile.png` |  |
| Reinitialisation mot de passe | `/reset-password` | `desktop-1440/07-reset-password-desktop.png` | `mobile-390/07-reset-password-mobile.png` |  |
| Qui sommes-nous | `/qui-sommes-nous` | `desktop-1440/08-about-desktop.png` | `mobile-390/08-about-mobile.png` |  |
| Comment ca marche | `/comment-ca-marche` | `desktop-1440/09-how-it-works-desktop.png` | `mobile-390/09-how-it-works-mobile.png` |  |
| Carrieres | `/carrieres` | `desktop-1440/10-careers-desktop.png` | `mobile-390/10-careers-mobile.png` |  |
| Centre aide | `/centre-aide` | `desktop-1440/11-help-center-desktop.png` | `mobile-390/11-help-center-mobile.png` |  |
| Contact | `/contact` | `desktop-1440/12-contact-desktop.png` | `mobile-390/12-contact-mobile.png` |  |
| CGU | `/cgu` | `desktop-1440/13-terms-desktop.png` | `mobile-390/13-terms-mobile.png` |  |
| Politique confidentialite | `/politique-confidentialite` | `desktop-1440/14-privacy-desktop.png` | `mobile-390/14-privacy-mobile.png` |  |
| 404 | `/page-inexistante-figma` | `desktop-1440/15-not-found-desktop.png` | `mobile-390/15-not-found-mobile.png` |  |
| Edition plat vendeur publique | `/seller/edit-dish/fallback-1` | `desktop-1440/16-seller-edit-dish-desktop.png` | `mobile-390/16-seller-edit-dish-mobile.png` |  |

## Routes protegees a capturer apres connexion

| Ecran | Route | Role requis | Note |
|---|---|---|---|
| Creation profil | `/create-profile` | connecte | Redirige vers `/login` sans session locale |
| Panier | `/panier` | acheteur | Redirige vers `/login` sans session locale |
| Checkout | `/checkout` | acheteur | Redirige vers `/login` sans session locale |
| Favoris | `/favoris` | acheteur | Redirige vers `/login` sans session locale |
| Profil acheteur | `/profile` | acheteur | Redirige vers `/login` sans session locale |
| Dashboard admin | `/dashboard` | admin | Redirige vers `/login` sans session locale |
| Dashboard vendeur | `/seller/dashboard` | vendeur | Redirige vers `/login` sans session locale |
| Plats vendeur | `/seller/dishes` | vendeur | Redirige vers `/login` sans session locale |
| Ajouter plat vendeur | `/seller/add-dish` | vendeur | Redirige vers `/login` sans session locale |
| Profil vendeur | `/seller/profile` | vendeur | Redirige vers `/login` sans session locale |
| Commandes vendeur | `/seller/orders` | vendeur | Redirige vers `/login` sans session locale |

## Methode Figma conseillee

1. Importer les PNG comme references visuelles.
2. Recréer les composants communs: Navbar, Footer, Button, CardPlat, formulaires auth, panneaux admin/vendeur.
3. Transformer les composants réutilisés en variants Figma, puis reconstruire les pages avec Auto Layout.