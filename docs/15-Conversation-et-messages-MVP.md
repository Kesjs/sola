# Conversation Sola — spécification complète MVP

## 1. Positionnement

Sola est un bot financier conversationnel. L’utilisateur ne navigue pas dans un dashboard classique : il échange avec Sola et reçoit, dans le fil de conversation, des informations vérifiées et des actions guidées.

La conversation est la surface principale du produit. L’authentification, la connexion du wallet, la consultation des soldes, l’historique et la préparation des opérations apparaissent dans ce même fil.

## 2. Structure d’écran

L’écran contient uniquement :

1. une entête globale compacte ;
2. un fil de messages indépendant et défilable ;
3. des raccourcis de commandes au-dessus du composer lorsque cela est utile ;
4. un composer fixé en bas, toujours accessible.

Il n’y a pas de page intermédiaire, de grand panneau “commencer une conversation”, ni de dashboard financier par défaut.

### Entête

- Identité : logo Sola et nom Sola.
- État secondaire discret : réseau actif ou état de synchronisation si nécessaire.
- Aucun doublon d’entête dans le fil.
- Aucun bouton décoratif, flèche isolée ou élément dont la fonction n’est pas évidente.

### Fil

- Le fil commence en haut avec le premier message de Sola.
- Le fil possède sa propre zone de scroll.
- Le composer reste hors du flux et ne disparaît pas lors d’une nouvelle réponse.
- La barre de scroll est masquée, mais le scroll tactile, molette et clavier restent actifs.
- Les nouveaux messages sont ajoutés sans déplacer brutalement un message que l’utilisateur est en train de lire.

## 3. Types de messages

### Message Sola

Message explicatif, question ou résultat retourné par une action.

- aligné à gauche ;
- fond `--surface` ;
- bordure `--border` ;
- texte `--ink` ;
- largeur maximale lisible ;
- aucun dégradé ni ombre ;
- rayon modéré, sans aspect de carte flottante.

### Message utilisateur

Demande écrite ou commande envoyée par l’utilisateur.

- aligné à droite ;
- fond `--ink` ;
- texte blanc ;
- largeur limitée pour préserver la lecture ;
- même rythme vertical que les messages de Sola.

### Message système

Chargement, synchronisation, changement de réseau ou résultat technique non conversationnel.

- aligné au centre ou sur toute la largeur selon le cas ;
- fond transparent ou `--surface` très léger ;
- texte `--muted` ;
- indicateur visuel simple, jamais un faux résultat.

### Message d’erreur

Erreur RPC, wallet absent, réseau incorrect ou transaction échouée.

- fond d’erreur très léger ;
- bordure `--danger` ;
- explication courte ;
- action de récupération explicite : Réessayer, Changer de réseau ou Annuler.

### Message de succès

Action vérifiée, connexion confirmée ou transaction confirmée.

- fond de surface normal ;
- bordure `--signal` ;
- signal vert limité à l’état positif et à l’action principale ;
- date, réseau et identifiant abrégé visibles pour toute donnée financière.

## 4. Arrière-plan des messages

Chaque message reçoit une surface visuelle légère afin de rester identifiable sans transformer la conversation en grille de cartes.

| Type | Arrière-plan | Bordure | Usage |
|---|---|---|---|
| Sola | `--surface` | `--border` | réponse, question, explication |
| Utilisateur | `--ink` | aucune ou `--ink` | demande et commande |
| Système | transparent / `--surface` | aucune | chargement et synchronisation |
| Succès | `--surface` | `--signal` | résultat vérifié |
| Alerte | mélange très léger avec `--warning` | `--warning` | attention non bloquante |
| Erreur | mélange très léger avec `--danger` | `--danger` | action bloquée ou échouée |

Les arrière-plans restent plats. Ils ne doivent jamais utiliser de gradient, glassmorphism, glow ou ombre portée. Une couleur d’état ne doit pas être utilisée pour décorer un message ordinaire.

## 5. Onboarding conversationnel

Le premier échange est court :

1. Sola se présente et explique sa fonction.
2. Sola demande une connexion.
3. Le message contient les actions `Continuer avec Google` et `Recevoir un lien magique`.
4. Le formulaire email ou le retour OAuth apparaît dans le fil, sous forme d’un composant inline.
5. Après authentification, Sola confirme la session et explique que le wallet permettra de lire les données.
6. L’utilisateur peut sélectionner `Connecter Phantom`.

Le composer reste présent à toutes les étapes. Avant authentification, une demande libre doit produire une réponse de guidage dans le fil et ne doit déclencher aucune opération financière.

## 6. Commandes et langage naturel

Les commandes sont des raccourcis, pas une limite produit.

```text
/balance   Consulter les soldes vérifiés
/history   Consulter l’historique vérifié
/receive   Préparer la réception d’un actif
/send      Préparer un transfert
/swap      Préparer un échange
/help      Afficher les capacités disponibles
/settings  Gérer les préférences
```

Une phrase comme “combien ai-je en SOL ?” doit être traitée comme `/balance`. L’assistant peut demander une précision, mais ne doit jamais inventer un solde, un prix, une transaction ou un statut.

## 7. États d’une interaction

Toute interaction prévoit explicitement :

- saisie ;
- validation ;
- chargement ;
- résultat vérifié ;
- résultat vide ;
- erreur récupérable ;
- action annulée ;
- attente de signature ;
- transaction en attente ;
- transaction confirmée ;
- transaction échouée.

Le chargement doit apparaître comme un message temporaire ou un état inline, sans faire disparaître le composer ni réinitialiser le fil.

## 8. Opérations sensibles

Pour `/send` et `/swap`, Sola collecte les informations dans la conversation, puis affiche un récapitulatif avant toute signature : actif, montant, destination, réseau, frais réseau, frais Sola et expiration éventuelle du devis.

Sola ne demande et ne stocke jamais : seed phrase, clé privée, code secret ou mot de passe de wallet.

La signature appartient exclusivement au wallet externe. Sola ne dit “confirmé” qu’après vérification du statut on-chain.

## 9. Contrat du moteur IA

Le modèle IA sert à comprendre l’intention, maintenir le contexte et formuler des réponses naturelles. Il ne décide pas seul d’une opération et n’a pas accès direct aux données sensibles.

Les actions passent par des outils contrôlés : profil, wallet, solde, historique, préparation de transfert, préparation de swap et administration. Chaque appel d’outil doit être journalisé et retourner une donnée explicitement vérifiable ou une erreur explicite.

## 10. Règles responsive

- conception mobile-first ;
- aucune largeur fixe qui provoque un débordement ;
- composer ancré avec les safe areas ;
- clavier mobile pris en compte avec les unités `dvh` ;
- zone de messages bornée avec `min-height: 0` ;
- cible tactile minimale de 44 px ;
- support du mode de mouvement réduit ;
- sur desktop, conversation centrée dans une colonne étroite, sans devenir un dashboard.

## 11. Critères d’acceptation visuelle

La version est acceptable si :

- le premier écran ressemble immédiatement à une conversation réelle ;
- le champ de message est visible sans scroll initial ;
- l’arrivée d’un message ne masque pas le composer ;
- un utilisateur peut scroller le fil sans barre visible ;
- aucun grand bloc ne ressemble à une landing page ou à une carte de dashboard ;
- chaque message est identifiable par sa position et son arrière-plan ;
- aucun état financier simulé n’est présenté comme réel ;
- les actions Google et Magic Link sont lisibles et correctement identifiées.

