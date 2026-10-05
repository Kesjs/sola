# PRD — Sola

### Product Requirements Document

**Version 1.0 — MVP**

---

## 1. Vision et problème

**Sola** est un wallet crypto conversationnel sur Solana. L'utilisateur connecte son wallet, consulte ses actifs en clair, et peut préparer des opérations (envoi, échange) via une interface classique **ou** via un agent conversationnel. Dans tous les cas, **l'utilisateur reste seul décisionnaire** : il vérifie chaque opération avant de la signer dans son propre wallet. Sola ne détient jamais les fonds et n'enregistre jamais de phrase secrète.

**Problème résolu** : la gestion d'un wallet crypto reste intimidante (adresses illisibles, frais opaques, peur de l'erreur irréversible). Sola simplifie la compréhension des actifs et la préparation des opérations, sans jamais retirer à l'utilisateur le contrôle de la signature.

**Cible** : utilisateurs débutants à intermédiaires sur Solana, à l'aise avec une messagerie (d'où la cible Telegram à terme), qui veulent un outil plus clair qu'un wallet technique mais plus sûr qu'une app qui agit à leur place.

**Promesse produit** : *« Un wallet compréhensible, avec un agent qui aide à agir, mais qui laisse toujours l'utilisateur vérifier et signer. »*

---

## 2. Boucle produit centrale

Le MVP entier est verrouillé autour d'une seule boucle, qui ne doit jamais être contournée :

```
Connecter son wallet → Comprendre ses actifs → Préparer une opération
→ Vérifier → Signer → Suivre le résultat
```

Toute fonctionnalité qui n'alimente pas directement cette boucle est repoussée en P1 ou P2.

---

## 3. Portée du MVP

### 3.1 — P0 (primordial, bloquant pour le lancement)

| # | Domaine | Contenu |
| --- | --- | --- |
| 1 | Gestion des utilisateurs | Création de compte, connexion/déconnexion, profil, séparation stricte des données, connexion Telegram future |
| 2 | Connexion du wallet | Wallet Solana, affichage adresse, connexion/déconnexion, détection réseau, aucune phrase secrète stockée |
| 3 | Tableau de bord | Solde SOL, solde USDT, valeur indicative, adresse, masquer les soldes, état de synchronisation |
| 4 | Historique | Reçues, envoyées, swaps, montant, date, frais, statut, lien explorateur Solana |
| 5 | Chatbot connecté aux vraies données | Répond sur solde, transactions, valeur, prépare envoi/échange — jamais d'invention |
| 6 | Recevoir | Choix SOL/USDT, adresse, copie, QR code, rappel réseau, avertissement anti-erreur de réseau |
| 7 | Envoyer | Destinataire, token, montant, frais réseau, solde après opération, vérification complète, confirmation wallet, suivi statut |
| 8 | Échanger | Token vendu/reçu, devis, taux, montant estimé, frais réseau, frais Sola, expiration du devis, signature wallet |
| 9 | Système de frais | Règles de commission, calcul avant confirmation, séparation frais réseau/Sola, enregistrement revenus, historique, config admin |
| 10 | Base de données et sécurité | Profils, wallets liés, opérations, transactions, devis, frais, messages agent, journaux de sécurité, permissions strictes |

### 3.2 — P1 (important, après validation du parcours principal)

Notifications · recherche dans l'activité · filtres de transactions · favoris/contacts vérifiés · multi-wallets · export d'historique · tableau de bord admin avancé · amélioration du chatbot · intégration Telegram · thème sombre synchronisé Telegram.

### 3.3 — P2 (repoussé, hors MVP)

Multi-blockchain · trading avancé · ordres automatiques · levier · staking · NFT · carte bancaire · marketplace crypto · copy trading · recommandations d'investissement · conservation de fonds (custody) · application mobile native.

---

## 4. Personas

**Léa, 27 ans, débutante crypto** A acheté un peu de SOL sur un exchange, ne comprend pas bien les adresses ni les frais. Veut un endroit simple pour voir ce qu'elle a et envoyer sans se tromper de réseau.

**Marc, 34 ans, utilisateur intermédiaire** Fait déjà des swaps occasionnels. Cherche un outil plus rapide qu'un DEX classique, avec un historique clair et un chatbot pour aller vite sans ouvrir plusieurs écrans.

**Admin Sola** Suit les revenus de commission, configure les règles de frais, surveille les journaux de sécurité.

---

## 5. Parcours utilisateur détaillé

### 5.1 Parcours principal (happy path)

1. L'utilisateur crée un compte / se connecte.
2. Il connecte son wallet Solana.
3. Il arrive sur le tableau de bord : soldes SOL/USDT, valeur indicative.
4. Il consulte son historique de transactions.
5. Il interagit avec le chatbot ou l'interface classique pour préparer une opération (envoi ou échange).
6. Un récapitulatif complet lui est présenté (montant, destinataire/devis, frais réseau, frais Sola, solde après opération).
7. Il vérifie, puis signe dans son wallet (jamais dans Sola).
8. Sola suit le statut on-chain et met à jour l'historique.

### 5.2 Parcours de réception

1. L'utilisateur choisit SOL ou USDT.
2. Sola affiche l'adresse et un QR code.
3. Un rappel explicite du réseau (Solana) et un avertissement contre les mauvais réseaux sont affichés en permanence.

### 5.3 Parcours chatbot

1. L'utilisateur pose une question ou une commande en langage naturel.
2. Le chatbot interroge les données réelles (wallet, historique, cotations) via des outils contrôlés.
3. Si la demande implique une opération, le chatbot prépare un **brouillon** d'opération — jamais une exécution directe.
4. L'utilisateur est redirigé vers l'écran de vérification standard (étape 6 du parcours principal).

---

## 6. Fonctionnalités détaillées — règles et critères d'acceptation

### 6.1 Gestion des utilisateurs

**Règles métier**

- Un compte = un identifiant unique (email ou futur identifiant Telegram).
- Toutes les données (wallets, opérations, messages agent) sont cloisonnées par `user_id` ; aucune requête ne doit pouvoir retourner les données d'un autre utilisateur.
- La connexion Telegram est prévue dans le modèle de données dès le MVP, même si l'intégration complète est P1.

**Critères d'acceptation**

- Un utilisateur ne peut jamais voir, même par une URL manipulée, les données d'un autre utilisateur.
- La déconnexion efface toute session active côté client et côté serveur.

### 6.2 Connexion du wallet

**Règles métier**

- Connexion via adaptateur wallet standard Solana (ex. Wallet Adapter) — aucune saisie de phrase secrète n'est jamais possible dans Sola.
- Le réseau (mainnet/devnet) est détecté et affiché ; toute opération sur un réseau inattendu est bloquée avec message explicite.

**Critères d'acceptation**

- Aucun champ de saisie de clé privée ou de seed phrase n'existe nulle part dans l'application.
- Un changement de réseau côté wallet est détecté en moins de quelques secondes et désactive les actions sensibles jusqu'à confirmation.

### 6.3 Tableau de bord du wallet

**Règles métier**

- Les soldes affichés proviennent exclusivement de la blockchain (lecture on-chain), jamais d'une valeur en cache non datée.
- La valeur indicative (en devise fiat) est calculée à partir d'une source de cotation déclarée, avec horodatage.

**Critères d'acceptation**

- Un bouton « masquer les soldes » remplace les montants par un masque visuel, sans recharger la page.
- Un indicateur d'état de synchronisation (à jour / en cours / erreur) est toujours visible.

### 6.4 Historique des transactions

**Règles métier**

- Chaque entrée (reçu, envoyé, swap) affiche : montant, date, frais, statut, lien direct vers l'explorateur Solana.
- Le statut reflète l'état réel on-chain (en attente, confirmé, échoué).

**Critères d'acceptation**

- Aucune transaction affichée ne peut être une donnée simulée ou en dur.
- Le lien explorateur pointe vers la transaction exacte (signature correcte).

### 6.5 Chatbot connecté aux données réelles

**Règles métier — garde-fous stricts**

- Le chatbot n'a accès qu'à des outils contrôlés (lecture solde, lecture historique, lecture cotation, préparation d'opération) — jamais d'accès libre ou de génération de chiffres.
- Si une donnée n'est pas disponible, le chatbot le dit explicitement ; il ne doit **jamais** inventer un solde, une transaction ou une confirmation de signature.
- Le chatbot ne signe et ne confirme jamais une opération lui-même : il prépare, l'utilisateur vérifie et signe.

**Critères d'acceptation (exemples obligatoires)**

- « Combien ai-je ? » → réponse basée sur lecture on-chain en temps réel.
- « Montre mes transactions. » → liste réelle, identique à l'écran Historique.
- « Quelle est la valeur de mon wallet ? » → calcul basé sur soldes réels + cotation datée.
- « Prépare un envoi. » → ouvre un brouillon d'envoi pré-rempli si possible, jamais exécuté automatiquement.
- « Prépare un échange. » → ouvre un brouillon de devis, jamais exécuté automatiquement.

### 6.6 Recevoir des crypto-actifs

**Règles métier**

- Sélection explicite du token (SOL ou USDT) avant affichage de l'adresse.
- Avertissement visible et permanent rappelant que seul le réseau Solana est supporté.

**Critères d'acceptation**

- Le QR code encode l'adresse exacte du wallet connecté.
- Le bouton copier confirme visuellement la copie (ex. message temporaire).

### 6.7 Envoyer des crypto-actifs

**Règles métier**

- Avant toute signature, l'utilisateur voit : adresse destinataire, token, montant, frais réseau estimés, solde après opération.
- Une vérification complète bloque l'envoi si le solde est insuffisant ou l'adresse invalide.
- La signature se fait exclusivement dans l'interface du wallet, jamais via un mot de passe Sola.

**Critères d'acceptation**

- Impossible de passer à l'étape de signature sans avoir vu l'écran récapitulatif complet.
- Le statut de l'opération est suivi jusqu'à confirmation ou échec, avec mise à jour visible dans l'historique.

### 6.8 Échanger SOL et USDT

**Règles métier**

- Le devis affiche : taux, montant estimé, frais réseau, frais Sola (séparés), et une expiration claire du devis.
- Passé le délai d'expiration, un nouveau devis doit être redemandé avant signature.
- La signature se fait dans le wallet ; Sola ne détient jamais les fonds pendant l'échange.

**Critères d'acceptation**

- Un devis expiré est visuellement marqué comme invalide et bloque la signature.
- Les frais réseau et les frais Sola apparaissent sur deux lignes distinctes, jamais fusionnées.

### 6.9 Système de frais

**Règles métier**

- Les règles de commission sont configurables côté administration (ex. pourcentage par type d'opération).
- Le calcul des frais est effectué et affiché **avant** toute confirmation, jamais après.
- Les frais réseau (Solana) et les frais Sola sont enregistrés séparément dans la base.
- Chaque prélèvement de frais génère une entrée dans l'historique des revenus.

**Critères d'acceptation**

- Un administrateur peut modifier une règle de frais sans déploiement de code.
- L'historique des frais est consultable et correspond exactement aux opérations effectuées.

### 6.10 Base de données et sécurité

**Entités minimales requises**

- Profils utilisateurs
- Wallets liés
- Opérations (brouillons préparés par l'utilisateur ou le chatbot)
- Transactions (résultats on-chain confirmés)
- Devis (échanges, avec expiration)
- Frais (réseau et Sola, séparés)
- Messages de l'agent (historique des échanges chatbot)
- Journaux de sécurité (connexions, actions sensibles, erreurs)

**Règles métier**

- Permissions strictes : chaque requête est filtrée par utilisateur authentifié (ex. Row Level Security si Supabase).
- Aucune donnée sensible (clé privée, seed) n'existe dans aucune table.

**Critères d'acceptation**

- Un audit des permissions ne doit révéler aucun accès croisé entre utilisateurs.
- Les journaux de sécurité enregistrent au minimum : connexions, tentatives d'opérations, erreurs de signature.

---

## 7. Exigences non fonctionnelles

- **Sécurité** : aucune phrase secrète ou clé privée n'est jamais stockée, transmise en clair hors du wallet, ou journalisée.
- **Fiabilité des données** : toute donnée financière affichée (solde, historique, devis) doit provenir d'une source on-chain ou d'une cotation datée — jamais d'une valeur codée en dur ou générée par le chatbot.
- **Disponibilité** : les écrans critiques (tableau de bord, envoi, échange) doivent afficher un état clair en cas d'indisponibilité du réseau Solana ou du fournisseur de cotation (chargement, erreur, réessayer).
- **Mobile-first** : l'interface est conçue pour un usage mobile dès le départ, en prévision de l'intégration Telegram.
- **Traçabilité** : toute opération signée doit être reliée à un identifiant utilisateur, un wallet, et un enregistrement en base.

---

## 8. Métriques de succès du MVP

- Taux de complétion de la boucle principale (connexion → opération signée).
- Taux d'erreur ou d'abandon à l'étape de vérification avant signature.
- Nombre de questions chatbot résolues sans intervention manuelle.
- Exactitude du chatbot (0 invention de donnée détectée en test).
- Revenus de commission enregistrés vs. opérations effectuées (cohérence à 100 %).

---

## 9. Risques et hypothèses

| Risque | Mitigation |
| --- | --- |
| Le chatbot invente une donnée (hallucination) | Outils contrôlés uniquement, aucune génération libre de chiffres, tests dédiés avant livraison |
| Erreur de réseau lors d'une réception | Rappel visuel permanent du réseau Solana sur l'écran Recevoir |
| Devis d'échange périmé utilisé pour signer | Expiration stricte et blocage automatique de la signature |
| Fuite de données entre utilisateurs | Permissions strictes en base dès la conception (P0, non négociable) |
| Dépendance à un seul fournisseur de cotation | Horodatage visible de la cotation, état d'erreur explicite si indisponible |

---

## 10. Hors scope (rappel)

Tout ce qui n'alimente pas directement la boucle *connecter → comprendre → préparer → vérifier → signer → suivre* est explicitement hors du MVP : multi-blockchain, trading avancé, ordres automatiques, levier, staking, NFT, carte bancaire, marketplace, copy trading, recommandations d'investissement, conservation de fonds, application mobile native.

---

## 11. Priorité de construction (rappel)

1. Interface web responsive
2. Authentification
3. Connexion wallet
4. Soldes réels
5. Activité réelle (historique)
6. Chatbot de consultation
7. Réception
8. Envoi
9. Swap
10. Frais
11. Tests de sécurité
12. Intégration Telegram

---

## 12. Glossaire

- **Devis** : estimation temporaire d'un échange (taux, montant, frais), avec expiration.
- **Opération** : brouillon d'action (envoi ou échange) préparé mais pas encore signé.
- **Transaction** : résultat confirmé on-chain d'une opération signée.
- **Frais réseau** : coût payé à la blockchain Solana, hors contrôle de Sola.
- **Frais Sola** : commission prélevée par Sola, configurable en administration.