# Interface et interactions — Sola MVP

## Principe d’interface

Sola est présenté comme une conversation. L’utilisateur ne découvre pas un dashboard financier classique : il parle à Sola, et Sola affiche les informations vérifiées dans cette conversation.

La spécification détaillée des messages, de leurs arrière-plans, des états conversationnels et des critères d’acceptation se trouve dans `15-Conversation-et-messages-MVP.md`.

## Parcours d’arrivée

### Démonstration avant connexion

- Une conversation courte explique ce que Sola peut faire.
- Aucun faux solde, aucune fausse transaction et aucune promesse financière.
- Un bouton clair permet de continuer.
- L’utilisateur arrive sur la connexion Google ou Magic Link.

### Connexion

- Deux choix visibles : `Continuer avec Google` et `Recevoir un lien magique`.
- Après authentification, Sola explique qu’un wallet est nécessaire pour lire les données.
- Un seul bouton principal : `Connecter Phantom`.

## Conversation principale

- Une seule entête globale.
- La conversation défile dans sa propre zone.
- Le champ de saisie reste accessible en bas.
- La barre de défilement est masquée mais le défilement tactile reste actif.
- Les commandes rapides sont des raccourcis, jamais le seul moyen d’utiliser Sola.
- Chaque message possède une surface légère selon son type : surface neutre pour Sola, contraste sombre pour l’utilisateur, état discret pour le système, bordure d’état pour les succès et erreurs.
- Les surfaces de messages restent plates : aucun dégradé, glassmorphism, glow ou ombre portée.

## Commandes prioritaires

```text
/balance   Voir les soldes réels
/history   Voir l’historique réel
/receive   Recevoir SOL ou USDT
/send      Préparer un transfert
/swap      Préparer un échange
/help      Afficher les possibilités
/settings  Gérer les préférences
```

L’utilisateur peut également écrire une demande en langage naturel. L’IA identifie l’intention, demande les informations manquantes et appelle uniquement l’outil autorisé correspondant.

## États obligatoires

Chaque action doit prévoir :

- chargement ;
- succès vérifié ;
- absence de données ;
- erreur RPC ;
- réseau incorrect ;
- wallet non connecté ;
- action annulée ;
- transaction en attente ;
- transaction confirmée ;
- transaction échouée.

## Interaction de transfert

Le transfert se déroule entièrement dans la conversation :

1. l’utilisateur demande un transfert ;
2. Sola demande le token, le montant et l’adresse ;
3. Sola vérifie les données ;
4. Sola affiche le récapitulatif et les frais séparés ;
5. l’utilisateur confirme l’intention ;
6. Phantom demande la signature ;
7. Sola affiche le statut réel de la transaction.

Sola ne demande jamais de code secret, seed phrase ou clé privée.

## Règles mobile-first

- cibles tactiles d’au moins 44 px ;
- respect des zones sûres ;
- pas de débordement horizontal ;
- clavier ne masquant jamais le champ actif ;
- contenu de conversation non masqué par le composer ;
- états de chargement visibles sans déplacer brutalement la conversation ;
- support du mode réduit en animations ;
- contraste lisible en mode clair et sombre.

## Direction visuelle

- toile claire et surfaces sobres ;
- vert Sola réservé aux états positifs et actions confirmées ;
- aucune donnée financière sans date ou état de synchronisation ;
- typographie Inter ;
- grille et espacements basés sur 8 px ;
- bordures fines, pas de dégradés décoratifs ;
- icônes vectorielles cohérentes, jamais d’emoji pour les contrôles.

## Administration

L’espace admin n’est pas mélangé à la conversation utilisateur. Il contient des vues protégées pour :

- utilisateurs ;
- wallets ;
- conversations et appels d’outils ;
- opérations ;
- transactions ;
- erreurs et journaux de sécurité ;
- frais et règles de commission.
