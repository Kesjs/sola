# Plan de réalisation — Sola MVP

## Décisions verrouillées

- Authentification : Magic Link et Google via Supabase Auth.
- Réseau initial : Solana devnet.
- Wallet initial : Phantom.
- Actifs MVP : SOL et USDT.
- Produit principal : chatbot conversationnel mobile-first.
- Parcours initial : démonstration courte → connexion → wallet → solde → historique.
- Transfert : étape suivante, préparée et signée uniquement dans Phantom.
- Agent : vrai modèle IA, limité à des outils contrôlés.
- Administration : utilisateurs, wallets, conversations, opérations, frais, erreurs et transactions.
- Telegram : après stabilisation du MVP web.

## Jalons

### J0 — Base produit

- Auth Google et Magic Link.
- Session, déconnexion et profils.
- RLS Supabase vérifié.
- Aucun secret wallet accepté ou stocké.

### J1 — Wallet et lecture réelle

- Connexion Phantom devnet.
- Détection du réseau.
- Enregistrement de l’adresse publique.
- Solde SOL/USDT réel avec horodatage.
- Historique réel avec statut et lien explorateur.

### J2 — Conversation réelle

- Modèle IA connecté au serveur.
- Outils `get_balance`, `get_transactions` et `get_portfolio_value`.
- Réponses naturelles et commandes raccourcies.
- Journalisation des messages et appels d’outils.
- Aucune donnée financière générée sans source.

### J3 — Transfert

- Conversation guidée pour préparer un transfert.
- Validation de l’adresse, du montant, du token et du réseau.
- Récapitulatif complet.
- Transaction non signée.
- Signature Phantom.
- Suivi on-chain jusqu’à confirmation ou échec.

### J4 — Administration et frais

- Accès admin séparé.
- Consultation des utilisateurs, wallets, conversations et opérations.
- Journal de sécurité.
- Configuration des frais.
- Aucun frais caché avant signature.

## Définition de « terminé »

Un jalon est terminé uniquement si :

1. le parcours fonctionne sur devnet ;
2. les données affichées sont vérifiables ;
3. les erreurs réseau sont visibles ;
4. les permissions ont été testées avec deux comptes ;
5. le comportement mobile est validé ;
6. aucune clé privée ou seed phrase n’est présente dans le code, les logs ou la base.

## Hors périmètre initial

- Dépôt ou conservation de fonds.
- Retrait depuis un compte custodial.
- Intégration Telegram.
- Multi-wallet avancé.
- Multi-chain.
- Trading automatique.
