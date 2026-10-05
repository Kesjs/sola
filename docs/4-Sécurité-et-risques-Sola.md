# Sécurité et risques — Sola

### Document de sécurité · MVP

**Version 1.0**

---

## 1. Objectif de ce document

Définir les règles de sécurité non négociables de Sola, le modèle de menace, les mécanismes de protection à chaque étape du parcours utilisateur, et les risques identifiés avec leur mitigation. Ce document complète l'architecture technique côté implémentation défensive.

---

## 2. Principes de sécurité non négociables

1. **Non-custodial absolu** : aucune clé privée, aucune phrase secrète n'est jamais saisie, transmise, stockée ou journalisée par Sola, à quelque étape que ce soit.
2. **Signature exclusivement côté wallet** : le backend construit des transactions non signées ; seul le wallet de l'utilisateur peut les signer.
3. **Agent sans autorité d'exécution** : l'agent conversationnel peut lire des données réelles et préparer des brouillons, mais ne peut jamais signer, confirmer ou diffuser une opération.
4. **Isolation stricte des données** : chaque utilisateur ne peut accéder qu'à ses propres données, garantie au niveau base de données (RLS), pas seulement au niveau applicatif.
5. **Vérification obligatoire avant signature** : aucune opération financière ne peut atteindre l'étape de signature sans passage par un écran de récapitulatif complet.
6. **Transparence des frais** : les frais réseau et les frais Sola sont toujours affichés séparément, avant confirmation.

---

## 3. Modèle de menace

| Acteur / scénario | Objectif de l'attaquant | Surface exposée |
| --- | --- | --- |
| Attaquant externe (phishing) | Faire signer une transaction malveillante (mauvaise adresse, mauvais montant) | Écran de récapitulatif, contenu de la transaction non signée |
| Utilisateur malveillant | Accéder aux données d'un autre utilisateur | API / fonctions serveur, base de données |
| Attaquant sur le canal agent | Manipuler l'agent pour lui faire halluciner un solde ou une confirmation (prompt injection) | Interface du chatbot, contenu des messages |
| Attaquant réseau | Intercepter une session ou une communication | Transport HTTP, cookies de session |
| Administrateur compromis | Modifier les règles de frais de façon abusive | Interface d'administration |
| Erreur de réseau Solana (mainnet/devnet) | Envoi de fonds sur un mauvais réseau par confusion | Détection réseau, affichage de l'adresse/QR code |

---

## 4. Sécurité de l'authentification

- Authentification gérée via Supabase Auth ; sessions courtes, renouvelées, invalidées explicitement à la déconnexion (client et serveur).
- Aucune donnée de session sensible stockée côté client au-delà du strict nécessaire (jeton de session géré par Supabase, jamais de clé API privée exposée au navigateur).
- Préparation à l'intégration Telegram : toute identité Telegram transmise au backend (`initData`) devra être validée par vérification de signature HMAC côté serveur avant d'être associée à un profil — jamais de confiance accordée à une donnée client non vérifiée.

---

## 5. Sécurité du flux de signature

**Étapes protégées du flux d'envoi ou de swap**

1. Le backend (fonction serveur TanStack Start) construit la transaction non signée à partir de paramètres validés côté serveur (jamais à partir d'une valeur uniquement vérifiée côté client).
2. Le frontend affiche un récapitulatif complet et non modifiable sans repasser par l'étape de préparation : destinataire, token, montant, frais réseau, frais Sola, solde après opération.
3. La transaction est transmise au wallet pour signature — Sola ne peut ni la modifier ni la signer après cette étape.
4. Après signature, la transaction est diffusée et son statut suivi via RPC jusqu'à confirmation ou échec.

**Protections spécifiques**

- **Anti-manipulation du montant** : le montant affiché à l'écran de vérification est celui effectivement encodé dans la transaction construite côté serveur — aucun recalcul côté client n'est source de vérité.
- **Anti-rejeu** : chaque transaction construite est liée à une opération unique en base (`operations`), avec un statut qui empêche sa réutilisation après signature ou expiration.
- **Détection de réseau** : toute incohérence entre le réseau déclaré par le wallet et le réseau attendu bloque la construction de la transaction, avec message explicite à l'utilisateur.

---

## 6. Sécurité des devis d'échange (swap)

- Chaque devis a une expiration stricte, contrôlée côté serveur (pas seulement affichée côté client).
- Un devis expiré est rejeté par la fonction serveur de signature même si le frontend tentait de le soumettre malgré tout.
- Le taux affiché ne peut pas être modifié côté client ; toute tentative de falsification du montant estimé est recalculée et vérifiée côté serveur avant construction de la transaction.

---

## 7. Isolation des données entre utilisateurs

- Row Level Security (RLS) activé sur toutes les tables contenant des données utilisateur (`profils`, `wallets_lies`, `operations`, `transactions`, `devis`, `frais`, `messages_agent`).
- Chaque politique RLS filtre par identifiant utilisateur correspondant strictement à la session authentifiée — aucune requête applicative ne doit pouvoir contourner ce filtre.
- Les fonctions serveur TanStack Start qui nécessitent un accès élargi (ex. calcul de frais globaux pour l'admin) utilisent une clé service Supabase réservée au serveur, jamais exposée au client.
- Un audit de permissions doit être effectué avant chaque mise en production : tentative volontaire d'accès croisé entre deux comptes de test, qui doit systématiquement échouer.

---

## 8. Sécurité de l'agent conversationnel

**Risque principal** : hallucination de données financières (solde, transaction, confirmation inventés) ou manipulation de l'agent par injection de prompt pour lui faire annoncer une fausse confirmation.

**Mitigations**

- L'agent n'a accès qu'à des outils fermés en lecture (`get_balance`, `get_transactions`, `get_portfolio_value`) et en préparation (`prepare_send`, `prepare_swap`) — aucun accès libre à une base de connaissances ou à un calcul non vérifiable.
- Si un outil ne retourne pas de donnée (erreur réseau, RPC indisponible), l'agent doit explicitement signaler l'indisponibilité — il lui est interdit de produire une valeur plausible par défaut.
- L'agent ne peut jamais indiquer qu'une opération a été signée ou confirmée : seule l'interface de suivi, alimentée par le statut on-chain réel, peut l'affirmer.
- Toute tentative de l'utilisateur (ou d'un contenu tiers injecté) visant à faire exécuter une action hors du périmètre des outils autorisés est sans effet, car l'agent ne dispose d'aucun outil d'exécution directe.
- Chaque appel d'outil par l'agent est journalisé (`messages_agent`) avec les paramètres et un résumé du résultat, pour permettre un audit en cas de réponse contestée.

---

## 9. Gestion des erreurs et des états limites

| Situation | Comportement attendu |
| --- | --- |
| RPC Solana indisponible | Affichage d'un état "synchronisation en erreur", aucune donnée obsolète présentée comme à jour |
| Fournisseur de cotation indisponible | Valeur indicative masquée ou marquée comme non disponible, jamais estimée arbitrairement |
| Transaction signée mais non confirmée après délai | Statut "en attente" affiché, suivi poursuivi, aucune fausse confirmation |
| Transaction échouée on-chain | Statut "échec" explicite, raison si disponible, aucun débit fantôme affiché |
| Double soumission accidentelle | L'opération déjà traitée est détectée en base, la seconde tentative est bloquée |
| Devis expiré soumis quand même | Rejet côté serveur, redemande d'un nouveau devis obligatoire |

---

## 10. Journalisation et audit

**Table `journaux_securite`** — événements minimum à enregistrer :

- Connexions et déconnexions (succès et échecs).
- Changements de réseau détectés sur le wallet.
- Tentatives de construction de transaction (succès, blocage, erreur).
- Échecs de signature ou de diffusion.
- Modifications des règles de frais par un administrateur.

**Règles de conservation**

- Les journaux de sécurité sont accessibles en lecture aux seuls comptes administrateurs.
- Aucune donnée sensible (adresse complète d'un tiers non concerné, montant d'un autre utilisateur) n'apparaît dans un journal consultable hors du périmètre de l'utilisateur concerné.

---

## 11. Table des risques identifiés

| Risque | Impact | Probabilité | Mitigation |
| --- | --- | --- | --- |
| Hallucination du chatbot sur un solde ou une confirmation | Élevé (perte de confiance, décision erronée) | Moyenne sans garde-fou | Outils fermés, interdiction explicite de valeur par défaut, tests dédiés avant livraison |
| Envoi sur un mauvais réseau | Élevé (perte de fonds irréversible) | Moyenne | Détection réseau systématique, rappel visuel permanent sur l'écran Recevoir |
| Devis de swap périmé utilisé pour signer | Moyen (mauvais taux appliqué) | Moyenne sans contrôle serveur | Expiration vérifiée côté serveur, pas seulement côté client |
| Fuite de données entre utilisateurs | Élevé (confidentialité, conformité) | Faible avec RLS correctement configuré | RLS sur toutes les tables, audit avant mise en production |
| Compromission de session | Moyen à élevé | Faible | Sessions courtes, renouvellement, déconnexion effective côté serveur |
| Abus de configuration des frais par un admin | Moyen (confiance utilisateur) | Faible | Journalisation de chaque changement de règle de frais |
| Dépendance à un seul fournisseur de cotation | Faible à moyen (indisponibilité temporaire) | Moyenne | État d'erreur explicite, pas d'estimation arbitraire |

---

## 12. Plan de réponse à incident (MVP)

1. **Détection** : alerte sur erreurs répétées de signature, pics d'échecs de transaction, ou activité anormale dans les journaux de sécurité.
2. **Confinement** : possibilité de désactiver temporairement la fonctionnalité concernée (ex. geler les swaps) sans affecter la consultation des soldes et de l'historique.
3. **Communication** : information claire à l'utilisateur affecté via l'interface (état "opération suspendue", jamais un silence ou une fausse confirmation).
4. **Analyse post-incident** : revue des journaux concernés, correction, mise à jour de ce document si un nouveau risque est identifié.

---

## 13. Checklist sécurité avant lancement

- [ ] Aucun champ de saisie de clé privée ou de seed phrase n'existe dans le code.
- [ ] RLS activé et testé sur toutes les tables contenant des données utilisateur.
- [ ] Audit d'accès croisé entre deux comptes de test : échec confirmé dans tous les cas.
- [ ] Tous les outils de l'agent testés pour absence de réponse inventée en cas d'indisponibilité de données.
- [ ] Expiration des devis vérifiée côté serveur, pas uniquement côté client.
- [ ] Détection de réseau testée sur changement manuel de réseau dans le wallet.
- [ ] Journaux de sécurité vérifiés sur un scénario de connexion, d'envoi et d'échec simulé.
- [ ] Aucune clé service Supabase ou clé d'API exposée côté client.