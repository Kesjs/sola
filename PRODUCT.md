# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TanStack Start + Supabase + Vercel. L'interface est web, responsive et mobile-first, avec une intégration Telegram prévue ultérieurement.

## Users

La cible prioritaire est constituée de débutants crypto, avec une expérience également adaptée aux utilisateurs intermédiaires de Solana.

Les utilisateurs veulent comprendre leurs actifs, leurs adresses et leurs frais, puis préparer des opérations sans perdre le contrôle de la signature.

## Product Purpose

Sola est un wallet crypto conversationnel sur Solana. Il permet de connecter un wallet, consulter ses actifs en clair, consulter son historique et préparer des opérations d'envoi ou d'échange via une interface classique ou un agent conversationnel.

Le produit simplifie la compréhension et la préparation des opérations sans détenir les fonds, stocker de phrase secrète ou retirer à l'utilisateur le contrôle de la signature.

Le succès du MVP se mesure par la complétion de la boucle : connecter son wallet, comprendre ses actifs, préparer une opération, vérifier, signer et suivre le résultat.

## Positioning

« Un wallet compréhensible, avec un agent qui aide à agir, mais qui laisse toujours l'utilisateur vérifier et signer. »

Le mécanisme distinctif est un agent conversationnel connecté à des données réelles et à des outils contrôlés, capable de préparer une opération mais incapable de la signer ou de l'exécuter seul.

## Operating Context

L'utilisateur accède à Sola depuis le web, avec une conception mobile-first anticipant un futur conteneur Telegram. Il connecte un wallet Solana compatible, consulte des données on-chain et utilise l'interface classique ou le chatbot pour préparer une opération.

Toute opération sensible passe par un récapitulatif complet, puis par la signature dans le wallet de l'utilisateur. Sola suit ensuite le statut on-chain et met à jour l'historique.

## Capabilities and Constraints

- Connexion et déconnexion d'un wallet Solana via un adaptateur standard.
- Affichage de soldes SOL/USDT, valeur indicative, adresse et état de synchronisation.
- Historique réel des transactions avec statut, frais et lien vers l'explorateur Solana.
- Préparation d'envois, de réceptions et d'échanges SOL/USDT.
- Affichage séparé des frais réseau et des frais Sola avant confirmation.
- Agent conversationnel limité à des outils contrôlés de lecture et de préparation.
- L'agent ne signe, ne confirme et ne diffuse jamais une opération.
- Aucune clé privée ou phrase secrète ne doit être demandée, stockée, transmise ou journalisée.
- Les données financières doivent provenir de la blockchain ou d'une cotation datée.
- Les données utilisateur doivent être isolées strictement par utilisateur, notamment via RLS dans Supabase.
- Le réseau inattendu, le solde insuffisant, l'adresse invalide et le devis expiré doivent bloquer les opérations sensibles.
- Le périmètre MVP exclut notamment le multi-blockchain, le trading avancé, le levier, le staking, les NFT, la custody et l'application mobile native.

## Brand Commitments

Le nom du produit est Sola. La promesse exacte à préserver est : « Un wallet compréhensible, avec un agent qui aide à agir, mais qui laisse toujours l'utilisateur vérifier et signer. »

## Evidence on Hand

Les documents de référence du produit sont conservés dans `Docs/` : PRD, architecture technique, sécurité et risques, données et API, business et frais, UX et design system.

Les données financières, transactions, cotations et confirmations ne doivent jamais être simulées ou inventées dans l'interface.

## Product Principles

- L'utilisateur reste toujours seul décisionnaire de la signature.
- La vérité financière vient de sources réelles, on-chain ou datées.
- L'agent aide à comprendre et préparer, mais ne possède aucune autorité d'exécution.
- La sécurité et l'isolation des données sont non négociables dès le MVP.
- Chaque étape sensible doit être compréhensible avant confirmation.

## Accessibility & Inclusion

L'interface doit être claire pour des débutants crypto, utilisable sur écran mobile étroit et explicite dans les états de chargement, d'erreur, de réseau inattendu et de confirmation.
