# Reformulation du besoin — SEOS, un compilateur d'architecture logicielle

## 1. Correction de cadrage

Ma première lecture a scopé le besoin à « un générateur CRUD Angular ». C'était trop étroit. Le vrai besoin, tel que reformulé : **capturer une architecture logicielle par observation, indépendamment du langage ou du framework** (Angular, React, Spring Boot, Rust, Solana, Kotlin, Swift), sans IA à l'étape d'extraction. L'IA n'intervient qu'ensuite, pour enrichir des parties créatives à l'intérieur d'une structure déjà déterminée par observation. C'est une reformulation plus juste et plus ambitieuse, et elle change l'évaluation technique.

## 2. Ce qui devient solide dans cette version

Trois choses que j'avais critiquées dans la version ChatGPT sont réglées par cette correction :

**Le déterminisme n'entre plus en conflit avec l'IA.** L'extraction de patterns par analyse statique (parcours d'AST, graphes de dépendances, fréquence d'apparition de structures) est une technique déterministe et bien établie — c'est le principe du *software repository mining* et de la découverte de design patterns par analyse structurelle, un champ de recherche réel depuis les années 2000 (détection automatique de patterns GoF, *frequent subgraph mining* sur des graphes d'appel). Zéro LLM à cette étape n'est pas seulement possible, c'est la bonne décision.

**L'analogie du compilateur est correcte et utile**, à condition de la suivre jusqu'au bout : DSL métier = langage source, Pattern Repository = représentation intermédiaire (IR), générateurs déterministes = backend, adaptateurs IA = enrichissement optionnel en périphérie, validateurs = vérification sémantique. Cette structure en pipeline avec un IR au centre est exactement ce qui manquait à la première formulation (qui mélangeait tout dans des « moteurs » sans hiérarchie claire).

**L'apprentissage de règles par fréquence (« les CRUD utilisent toujours Facade, les Dialog jamais ») est de l'apprentissage de règles d'association classique** (type Apriori), pas du machine learning au sens flou du terme. C'est vérifiable, testable, explicable — cohérent avec l'exigence de traçabilité posée dès le premier échange.

## 3. Le vrai point dur : ce n'est pas le pipeline, c'est l'IR

Un compilateur qui supporte plusieurs langages source ne partage pas un seul frontend — il partage l'IR. GCC et LLVM ont un frontend par langage (C, Rust, Swift...) et un seul IR au milieu. Le problème difficile de SEOS n'est donc pas d'écrire « un moteur d'extraction générique ». C'est de concevoir un IR — le Pattern Repository — assez abstrait pour représenter des architectures qui n'ont, à la base, rien en commun :

- Angular/Spring Boot/Kotlin/Swift partagent globalement un vocabulaire (classes, injection de dépendances, couches, façades) — les patterns s'y expriment en termes de fichiers, responsabilités, dépendances.
- Rust n'a pas d'héritage ni d'injection de dépendances au sens OOP ; ses patterns architecturaux s'articulent autour de l'ownership, des traits, des lifetimes.
- Solana (programmes on-chain) n'a ni classes, ni DI, ni CRUD au sens classique : l'architecture y est un modèle de comptes (accounts), d'instructions et de PDA (program derived addresses) — un paradigme complètement différent, pas juste une autre syntaxe du même concept.

Autrement dit, « Pattern → Files → Dependencies → Responsibilities → Tests → Documentation » décrit très bien une architecture façon DDD/Clean Architecture. Il ne décrit pas nécessairement un pattern Solana ou un pattern Rust — il faudra vérifier, quand on y arrivera, que ce schéma tient ou doit être étendu. C'est le risque de conception le plus important du projet, et il vaut mieux le découvrir tôt, sur un cas réel, que de le supposer résolu.

## 4. Séquencement recommandé — appliquer sa propre analogie jusqu'au bout

Un compilateur multi-langage ne naît jamais avec six frontends en parallèle. On construit un frontend, un IR, un backend, on les fait fonctionner de bout en bout sur un cas réel, puis on ajoute des frontends un par un en généralisant l'IR seulement quand un nouveau langage force à le faire.

Proposition concrète pour SEOS :

1. **Concevoir l'IR (Pattern Repository) pour qu'il soit langage-agnostique dès le départ dans sa forme** (champs génériques : structure, dépendances, responsabilités, invariants, tests, documentation), sans se limiter au vocabulaire DDD — mais sans chercher non plus à deviner à l'avance ce qu'exigeront les frontends suivants.
2. **Construire un seul frontend d'abord : TypeScript/Angular, et à l'intérieur de ce frontend, un seul module : `administrative-infrastructure`** (module de référence). Ne pas chercher à rendre tous les modules du projet identiques au modèle de référence avant d'avoir prouvé le pipeline complet sur ce module seul — c'est précisément la dérive constatée en pratique (une migration classless étendue à 74 fichiers sur 17 modules, avant même que le pipeline extraction → génération → validation ait été validé de bout en bout). Outillage réaliste : parcours de l'AST via l'API du compilateur TypeScript, construction d'un graphe de dépendances par entité, extraction de la signature structurelle (quels fichiers, quelles couches, qui importe quoi).
3. **Valider le pipeline complet sur ce seul module** : extraction → Pattern Repository → génération déterministe → validation. Seulement à ce stade, l'IR aura été éprouvé sur un cas réel plutôt que sur une hypothèse. Les autres modules Angular du projet ne sont pas un objectif d'étape 2 — leur éventuelle mise en conformité est une conséquence possible, plus tard, pas un prérequis pour avancer.
4. **Ajouter une deuxième cible délibérément différente avant d'aller plus loin, une fois tous les objectifs d'étape 2 atteints sur `administrative-infrastructure`** — un projet TypeScript organisé en monorepo à packages (type Nx), plutôt que Rust ou Solana. Ce choix est un compromis assumé, pas une généralisation gratuite : Rust/Solana restaient la cible idéale pour tester la limite de l'IR sur un changement de *paradigme* (pas d'héritage/DI en Rust, modèle de comptes/PDA en Solana — voir §3), mais aucun codebase réel de ce type n'existe ni n'est prévu ici, et en fabriquer un artificiellement uniquement pour le test romprait la discipline « toujours du code réel » suivie depuis le début du projet. Un projet Nx package-based partage le même vocabulaire qu'Angular (classes, DI, TypeScript) : ce deuxième frontend testera donc la généralisation de l'IR à une *structure organisationnelle* différente (monorepo multi-packages, frontières de build, versioning indépendant) — pas sa généralisation à un *paradigme* différent. Les deux questions sont réelles mais distinctes ; il ne faut pas confondre l'une avec l'autre dans les conclusions qui seront tirées de cette étape.
5. **Rust/Solana (ou tout autre paradigme non-OOP) reste un objectif différé, pas abandonné** : à reconsidérer si un codebase réel de ce type devient disponible. Tant qu'il ne l'est pas, le projet accepte consciemment de ne pas avoir testé l'hypothèse la plus dure (l'IR est-il vraiment agnostique au paradigme, ou seulement à la syntaxe à l'intérieur d'un même paradigme OOP/DI ?).
6. Seulement ensuite, généraliser aux autres langages/structures listés.

## 5. Limite actuelle du signal disponible

Le principe « après 200 générations, le système sait que... » suppose un corpus de 200 instances observées. Ce projet en contient aujourd'hui 3 pour le pattern CRUD (`regions`, `departments`, `municipalities`) — un signal réel mais statistiquement mince pour qu'un mineur de règles soit fiable seul. Deux implications pratiques :

- Le Pattern Extraction Engine doit être conçu pour apprendre en continu (chaque nouvelle entité ajoutée au projet enrichit le corpus), pas comme un traitement one-shot.
- Avant que la fréquence seule soit fiable, un catalogue de patterns explicité manuellement (ce que la v1 du document précédent proposait) sert de vérité de départ contre laquelle valider ce que le mineur trouve automatiquement — les deux approches se complètent, elles ne s'excluent pas.

## 6. Ce que ça change concrètement

Le besoin n'est plus « générer des fichiers Angular », il est : **construire un compilateur dont l'IR capture n'importe quelle architecture logicielle, prouvé d'abord sur un module réel unique (`administrative-infrastructure`, Angular/TS), avant de généraliser.** L'ambition multi-langage est légitime et bien formulée ; le risque principal n'est pas la faisabilité de l'idée mais la tentation de concevoir l'IR — ou de faire converger tout un projet — pour un périmètre plus large que celui réellement validé contre du code réel.

## Addendum — Révision de séquencement (2026-07-16)

Deux corrections apportées à la section 4 suite à un constat d'exécution :

1. **Étape 2 resserrée sur `administrative-infrastructure` seul.** En pratique, la migration classless VO/Entity avait dérivé vers 74 fichiers sur 17 modules du projet Angular, alors que le pipeline complet (extraction → Pattern Repository → génération → validation) n'avait pas encore été prouvé de bout en bout sur un module unique. Le document original demandait déjà « un seul frontend d'abord » ; cette révision précise que ça vaut aussi *à l'intérieur* du frontend Angular : un seul module de référence, pas une convergence de tout le projet.
2. **Étape 4 remplace Rust/Solana par un projet TypeScript monorepo à packages (type Nx)** comme deuxième cible, pour des raisons pratiques (aucun codebase Rust/Solana réel disponible, et en fabriquer un artificiellement violerait la discipline « toujours du code réel »). Ce choix est documenté comme un **compromis assumé, pas une équivalence** : il testera la généralisation de l'IR à une structure organisationnelle différente (monorepo multi-packages), pas à un paradigme différent (absence d'héritage/DI, modèle de comptes on-chain). L'hypothèse la plus dure du projet — l'IR est-il agnostique au paradigme ou seulement à la syntaxe à l'intérieur du monde OOP/DI — reste non testée et différée, pas résolue.
