# Business et frais — Sola

### Modèle de revenus et gouvernance des frais · MVP

**Version 1.0**

---

## 1. Objectif

Définir comment Sola génère des revenus via les frais de service, comment ces frais sont calculés et affichés, et comment ils sont administrés — en cohérence avec l'exigence de transparence totale posée dans le PRD (section 6.9) et le document de sécurité (principe n°6).

---

## 2. Modèle de revenus

Sola génère des revenus par une **commission de service** (« frais Sola ») appliquée sur les opérations qu'elle facilite :

| Opération | Frais Sola applicable au MVP |
| --- | --- |
| Réception | Aucun |
| Envoi | Oui, en option selon la configuration (voir §3) |
| Échange (swap) | Oui, systématique |

Le frais réseau (payé à la blockchain Solana) **n'est jamais une source de revenu pour Sola** — il est reversé intégralement au réseau et affiché séparément en permanence.

---

## 3. Règles de calcul des frais

- Chaque type d'opération (`envoi`, `swap`) a une règle active dans `config_frais` : un pourcentage, avec un minimum et un maximum optionnels.
- Le frais Sola est calculé **au moment de la préparation de l'opération** (fonction serveur `prepareSend` / `prepareSwap`), jamais après la signature.
- Formule générale :

```
frais_sola = max(minimum, min(maximum, montant × pourcentage))
```

- Si aucun minimum/maximum n'est défini pour un type d'opération, seul le pourcentage s'applique.
- Le frais réseau est estimé séparément via le RPC Solana (coût de la transaction), indépendamment de la règle de commission Sola.

**Exemple chiffré (swap)**

- Montant échangé : 100 USDT
- Pourcentage configuré : 0,5 %
- Frais Sola : 0,50 USDT
- Frais réseau estimé : \~0,0005 SOL (variable selon l'état du réseau)
- Les deux montants sont affichés sur deux lignes distinctes avant signature, jamais fusionnés ni arrondis ensemble.

---

## 4. Transparence obligatoire envers l'utilisateur

Conformément au PRD et au document de sécurité :

- Le frais Sola et le frais réseau sont **toujours** affichés avant toute confirmation, sur l'écran de récapitulatif.
- Le pourcentage de commission actif est consultable par tout utilisateur authentifié (lecture de `config_frais`), même en dehors d'une opération en cours — aucune règle cachée.
- Un devis de swap affiche le taux, le montant estimé, les deux types de frais, et l'heure d'expiration du devis.

---

## 5. Configuration administrateur

**Qui peut modifier les règles**

- Seuls les comptes au rôle `admin` peuvent appeler la fonction serveur `updateFeeConfig`.
- Toute modification (pourcentage, minimum, maximum, activation/désactivation d'une règle) est horodatée (`modifie_le`) et journalisée dans `journaux_securite`.

**Ce qui est configurable sans déploiement**

- Pourcentage de commission par type d'opération (`envoi`, `swap`).
- Minimum et maximum de frais Sola par opération.
- Activation ou désactivation d'un type de frais (ex. rendre l'envoi temporairement gratuit).

**Ce qui n'est pas configurable au MVP**

- Frais différenciés par utilisateur ou par palier de volume (réservé à une itération future).
- Remises ou codes promotionnels.

---

## 6. Enregistrement des revenus

- Chaque transaction confirmée génère une entrée dans `frais`, liée à la `config_frais` appliquée au moment du calcul (traçabilité même si la règle change ensuite).
- Le montant `montant_sola` de chaque entrée constitue la base du calcul des revenus de Sola.
- Le montant `montant_reseau` est conservé à titre informatif et de réconciliation, mais ne constitue pas un revenu.

---

## 7. Reporting et tableau de bord admin (MVP minimal)

Le tableau de bord administrateur (fonctionnalité P0 en version minimale, approfondie en P1) doit permettre :

- de consulter le total des frais Sola perçus sur une période ;
- de filtrer par type d'opération (envoi / swap) ;
- de consulter l'historique des modifications de `config_frais` ;
- d'identifier toute opération dont le frais Sola enregistré ne correspond pas à la règle active au moment de la transaction (anomalie à investiguer).

---

## 8. Risques business

| Risque | Impact | Mitigation |
| --- | --- | --- |
| Commission perçue comme trop élevée par rapport aux DEX classiques | Faible adoption | Transparence totale, pourcentage ajustable sans déploiement |
| Erreur de configuration (ex. pourcentage à 0 par erreur) | Perte de revenu temporaire | Journalisation de chaque changement, revue possible a posteriori |
| Incohérence entre frais affiché et frais réellement prélevé | Perte de confiance, risque de litige | Frais calculé et affiché au même moment par la même fonction serveur, aucun recalcul silencieux après signature |
| Dépendance au volume de swap pour la majorité du revenu | Revenu concentré sur une seule fonctionnalité | Possibilité d'activer un frais sur l'envoi via configuration existante |

---

## 9. Ce que ce modèle garantit

- Aucun frais n'est jamais prélevé sans avoir été affiché et confirmé avant signature.
- Le frais réseau n'est jamais présenté comme un revenu Sola, et inversement.
- Toute modification des règles de commission est traçable (qui, quand, quelle valeur).
- Le modèle reste simple et ajustable au stade MVP, sans complexité de paliers ou de remises qui retarderait le lancement.