# SEOS — Research Charter (v0)

Statut : programme de recherche appliquée, pas un produit logiciel. Ce document fixe les règles qui restent stables tant qu'une Convergence Review ne les révise pas explicitement (voir §6).

## 0bis. Révision de principe (post-revue de littérature, ArchAgent 2026)

Le principe fondateur « aucune IA à l'extraction » (§4 ci-dessous, formulé dès les premiers échanges) est abandonné. Raison, appuyée sur la littérature vérifiée (pas une opinion) : les méthodes déterministes classiques de recouvrement d'architecture (ACDC 2000, ARC 2011, Bunch 1999 — les prédécesseurs directs d'EXP-001/002/003) ont une limite documentée depuis 20 ans : elles capturent la structure mais pas la sémantique métier. Le système de référence le plus rigoureusement validé à ce jour sur cette tâche exacte (ArchAgent, HiThink Research/USTC, janvier 2026, arXiv:2601.13007) place le LLM au cœur de la synthèse, pas en périphérie, précisément pour cette raison, et le démontre avec une méthodologie statistique réelle (30 évaluateurs, protocole intra-sujet contrebalancé, tests t appariés, tailles d'effet).

Conséquence : la séparation stricte "connaissance observée (jamais IA) / connaissance déclarée (jamais déduite)" du §4 est révisée. L'IA peut désormais produire des hypothèses d'Intent directement depuis le code — à condition que ces hypothèses restent vérifiables et tracées (voir Expérience 004, Assumptions Register), pas que le principe de vérifiabilité soit abandonné avec le principe de non-IA. Ce qui reste non négociable : toute affirmation produite par l'IA doit rester falsifiable contre le code réel, comme dans le protocole d'évaluation d'ArchAgent (vrai/faux vérifié élément par élément), pas acceptée sur la seule confiance du modèle.

## 0. Ce que SEOS est, à ce stade

SEOS n'est pas un générateur de code Angular, ni un compilateur au sens classique. C'est un programme de recherche qui cherche à déterminer s'il existe un modèle capable de représenter les responsabilités architecturales fondamentales de plusieurs familles de logiciels, indépendamment de leur technologie d'implémentation. Le générateur Angular est le premier cas d'étude, pas la finalité.

## 1. Research Question

Existe-t-il un modèle canonique (Architecture Ontology Candidate, AOC) capable de représenter les responsabilités architecturales fondamentales de plusieurs lignées de logiciels indépendantes, sans dépendre de leurs technologies d'implémentation ?

**H0 (hypothèse nulle)** — Il n'existe pas de modèle canonique suffisamment expressif. Chaque lignée nécessite un modèle propre, relié aux autres uniquement par des correspondances ponctuelles.

**H1 (hypothèse alternative)** — Il existe un noyau commun (Core Ontology). Les modèles spécialisés par lignée peuvent être décrits comme des extensions de ce noyau.

### Protocole de falsification (ce qui manquait jusqu'ici)

Une hypothèse formulée sans protocole de mesure n'est falsifiable qu'en principe, pas en pratique. Protocole retenu :

1. **Corpus de test fixé à l'avance**, avant toute tentative de convergence :
   - Enterprise OOP : les facades/services/mappers réels de `administrative-boundary` (regions, departments, municipalities) dans ce projet.
   - Functional UI : 3 à 5 responsabilités réelles et documentées d'une application Elm ou Redux/TEA existante (pas un exemple inventé).
   - Une troisième lignée choisie au moment du test (Systems ou Blockchain), avec le même nombre de responsabilités réelles.
2. **Mesure** : pour chaque responsabilité du corpus, tenter de l'exprimer dans l'AOC courant. Compter la proportion qui nécessite un concept ad hoc non prévu par l'AOC (un « échappatoire »).
3. **Seuil décisionnel**, fixé avant le test, pas après :
   - Si moins de 20 % des responsabilités de chaque lignée nécessitent un échappatoire : signal en faveur de H1, l'AOC est promu candidat pour le Core.
   - Si plus de 50 % nécessitent un échappatoire sur au moins une lignée : signal en faveur de H0 pour cette lignée, elle reste un Family Model indépendant.
   - Entre les deux : résultat non concluant, le corpus de test doit être enrichi avant de trancher.
4. Le seuil et le corpus doivent être écrits **avant** la Convergence Review qui les évalue, jamais ajustés après coup pour faire correspondre le résultat à la conclusion souhaitée.

## 2. Lignées architecturales (unité de comparaison)

La comparaison ne se fait jamais entre deux frameworks d'une même lignée (ex. Angular vs Spring, qui partagent une ascendance Java EE/DI). Elle se fait entre lignées génétiquement indépendantes :

| Lignée | Exemples | Caractéristique structurante |
|---|---|---|
| Enterprise OOP | Angular, Spring, NestJS, ASP.NET, Laravel | Classes, injection de dépendances, couches |
| Functional UI | Elm, Redux, The Elm Architecture | Pas de classes, pas de DI, état immuable, boucle de mise à jour |
| Systems | Rust, Go | Ownership, absence d'héritage, pas de DI classique |
| Blockchain | Solana, Cosmos, Move | État par comptes, instructions, pas de CRUD au sens classique |
| Dataflow | Airflow, Beam | Pipelines déclaratifs, pas de couches applicatives |

Une abstraction observée dans une seule lignée reste locale à cette lignée. Elle ne devient candidate au Core qu'après la Rule 0.

## 3. Rule 0 — critère de promotion vers le Core

Un concept ne peut entrer dans le modèle central (Core Ontology) que s'il satisfait, dans cet ordre :

1. Il apparaît naturellement dans au moins deux lignées indépendantes (pas deux frameworks de la même lignée).
2. Il est définissable sans référence à une technologie particulière.
3. Il est justifiable par des exemples réels tirés du corpus de test (§1), pas par un exemple imaginé pour l'occasion.
4. Il améliore mesurablement la capacité de projection du système (moins d'échappatoires nécessaires avec le concept qu'sans lui).

Tant qu'un concept ne remplit pas ces quatre conditions, il reste dans son Family Model d'origine. Aucune exception.

## 4. Connaissance observée vs déclarée vs inférée (révisé, voir §0bis)

Trois sources de connaissance désormais, jamais confondues sans étiquette claire sur leur origine :

- **Connaissance observée** : extraite automatiquement du code par analyse structurelle pure (AST, graphe de dépendances, fréquence). Déterministe, falsifiable, reproductible.
- **Connaissance déclarée** : introduite explicitement par les architectes (ADR, décisions, contraintes, vocabulaire d'Intent). Jamais déduite automatiquement.
- **Connaissance inférée (nouveau)** : produite par un LLM à partir du code et de son contexte (à la manière d'ArchAgent). Plausible mais jamais acceptée telle quelle — chaque affirmation doit être vérifiée élément par élément contre le code réel (protocole vrai/faux, comme les évaluateurs humains d'ArchAgent) avant d'être promue en connaissance déclarée. Tant qu'elle n'est pas vérifiée, elle reste marquée "hypothèse IA non vérifiée".

**Mécanisme de lien (précision nécessaire)** : les deux sources ne se déduisent jamais l'une de l'autre, mais elles sont reliées par une table d'association explicite et annotée par un humain (ex. « Facade observé dans `departments.facade.ts` → Intent déclarée : Orchestration »). Sans ce lien traçable, la connaissance déclarée ne peut jamais s'appliquer au code réel. Ce lien est lui-même un artefact versionné, jamais généré automatiquement.

## 5. Convergence Review

Cadence : tous les trimestres. Pendant la review, les Family Models des lignées testées à ce stade sont confrontés sur le corpus de test courant. Chaque concept candidat est : conservé dans son Family Model, fusionné avec un concept équivalent d'une autre lignée, promu au Core (si Rule 0 est satisfaite), ou supprimé (si le corpus l'invalide). Aucune promotion ni fusion ne se décide en dehors d'une Convergence Review documentée.

## 6. Research-Safe Architecture

Principe de conception non négociable : le projet doit produire de la valeur quel que soit le résultat de la Research Question. Concrètement :

- Si H1 est confirmée (un Core existe) : SEOS l'utilise, les générateurs par lignée deviennent des projections du Core.
- Si H0 est confirmée (pas de Core) : SEOS reste utile avec des Family Models indépendants reliés par des correspondances explicites (§4) — chaque lignée garde son propre générateur déterministe, sans dépendre d'une unification qui n'existe pas.
- Si convergence partielle : SEOS exploite les concepts qui ont franchi Rule 0 et laisse le reste local.

Cette propriété n'est pas une fonctionnalité ajoutée après coup : l'infrastructure de correspondance (§4) est strictement la même, que H0 ou H1 se vérifie. Rien n'est perdu si l'hypothèse centrale échoue.

## 7. Définitions opérationnelles (pas de philosophie premiers principes)

Principe retenu : un concept se définit par la procédure exacte qui permet de le détecter ou de le produire, jamais par son essence. Une tentative antérieure de document "Foundations" proposait des définitions au sens philosophique (« qu'est-ce qu'un logiciel, une architecture, une responsabilité ») — écartée volontairement : ce type de définition n'est ni testable ni nécessaire à la Research Question, et une des formulations proposées (Famille = ensemble d'architectures partageant des invariants fondamentaux) était circulaire, puisqu'elle présuppose le résultat même que Rule 0 et les Convergence Reviews doivent découvrir empiriquement. Les définitions ci-dessous remplacent cette approche.

- **AOC (Architecture Ontology Candidate)** — modèle canonique proposé, versionné (v0.1, v0.2...), toujours qualifié de candidat, jamais de vérité acquise.
- **Core Ontology** — sous-ensemble de l'AOC ayant franchi la Rule 0 (§3). Non circulaire : défini par une procédure de promotion vérifiable, pas par des invariants supposés déjà connus.
- **Family Model** — l'ensemble des Patterns et Intents catalogués pour une lignée donnée, avant toute tentative de comparaison inter-lignées. Défini par le périmètre du travail de catalogage effectué, pas par des invariants pas encore découverts.
- **Lignée (architectural lineage)** — regroupement pré-enregistré (§2), fixé avant tout test de convergence, sur la base d'une ascendance technique documentée (modèle d'exécution partagé, origine paradigmatique commune). Ne se redéfinit jamais après coup pour faire coller un résultat.
- **Pattern** — une signature structurelle (ensemble de fichiers + forme du graphe d'imports) qui se répète à l'identique sur au moins 3 instances indépendantes d'une même lignée dans le corpus. Procédure de détection : analyse d'AST + graphe de dépendances + comptage de fréquence. Fait observable, jamais une interprétation.
- **Intent** — un label attaché par un architecte humain à un ou plusieurs Patterns, enregistré dans la table de lien (§4). Jamais inféré automatiquement ; procédure de production : annotation manuelle tracée, pas un algorithme.
- **Projection** — une correspondance documentée et versionnée entre une Intent et son Pattern spécifique à une lignée (ex. Orchestration → Facade en Enterprise OOP). Test opérationnel de "préservation des invariants" : un relecteur qui ne voit que le Pattern doit pouvoir retrouver l'Intent déclarée sans avoir vu la correspondance d'origine (test en aveugle, emprunté aux méthodes de réplication scientifique) — pas une notion philosophique.
- **Connaissance observée / déclarée** — voir §4.
- **Convergence Review** — voir §5.
- **Research-Safe Architecture** — voir §6.

## 7bis. Règle anti-régression

Aucun nouveau document de gouvernance ou de fondation (charter, foundations, philosophy...) n'est rédigé tant qu'au moins une entrée réelle du corpus de test (§1) — une responsabilité effectivement collectée dans une lignée non-Enterprise-OOP, effectivement confrontée à l'AOC courant — n'existe pas. Cette règle existe parce que le projet a produit, à ce stade, huit artefacts de gouvernance (Vision, Philosophy, reformulation de besoin, Research Charter, Research Log, Assumptions Register...) et zéro donnée de corpus. Un nouveau document ne peut être une réponse à ce déséquilibre ; seule la collecte du corpus l'est. Voir Assumptions Register (`SEOS-Assumptions-Register.md`) pour le suivi des hypothèses déjà actives.

## 8. Roadmap (rappel, imbriquée dans le programme de recherche)

La roadmap Angular détaillée dans `besoin-reformule-SEOS.md` (générateur déterministe → validation → IA en périphérie) reste valide, mais elle est maintenant le premier cas d'étude Enterprise OOP de ce programme, pas la finalité du projet. Aucun travail d'ingénierie multi-lignée ne démarre avant qu'un premier corpus de test Functional UI (§1) soit réellement constitué à partir de code existant, pas imaginé.
