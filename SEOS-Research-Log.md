# SEOS — Research Log v0

Historique factuel du projet, reconstitué à partir de deux fils ChatGPT partagés et de la discussion de suivi. Volontairement dépouillé de la dramatisation narrative ("Claude détruit l'hypothèse...") du deuxième fil ChatGPT : ce qui suit décrit ce qui a été proposé, par qui, et ce qui a effectivement changé — pas une histoire mise en scène.

## Étape 0 — Le problème concret de départ

Constat initial : dans `cmz-backoffice-frontend`, chaque nouvelle entité métier (region, department, municipality...) exige de recréer manuellement ou par prompt le même ensemble d'une trentaine de fichiers en couches (domain/application/infrastructure/presentation). Chaque génération recommence à zéro : il faut réexpliquer Angular, DDD, PrimeNG, OpenLayers à chaque fois. Le problème formulé : éviter de reconstruire ce contexte à chaque feature.

Vérification faite sur le code réel (pas supposée) : le module `administrative-boundary` confirme ce pattern répété à l'identique sur `regions`, `departments`, `municipalities`.

## Étape 1 — Premier fil ChatGPT : de "générateur de prompts" à "Software Engineering Operating System"

Le premier fil (partagé sous le titre *Architecte de fonctionnalités*) fait progresser l'idée en plusieurs paliers, chacun englobant le précédent plutôt que le remplaçant :

1. Générateur de prompts → cohérence des prompts insuffisante.
2. DSL métier décrivant le domaine plutôt que des prompts.
3. Le DSL n'est pas la vérité — introduction d'un "Knowledge Graph" comme source de vérité.
4. Proposition de huit "moteurs" (Specification, Architecture, Context, Knowledge, Prompt, Generation, Validation, Refactoring Engine) et d'une plateforme nommée SEOS.
5. Rédaction envisagée d'un "Vision Document" et d'une "Philosophy", avec dix principes (le code n'est pas la vérité, l'IA ne décide jamais seule, tout est traçable, etc.).

Ce fil n'a jamais été confronté au code réel du projet ni à un regard critique externe avant cette conversation.

## Étape 2 — Première critique externe (Claude, lecture du fil)

Lecture du fil du point de vue ingénierie, avec vérification du code réel (`administrative-boundary`). Constats :

- L'analogie "chez Meta personne n'écrit un prompt le matin" est une généralisation trompeuse — Meta utilise des schémas comme source de vérité dans des domaines étroits (GraphQL/Thrift), pas comme pratique générale.
- Le principe "génération déterministe" et l'usage d'un LLM comme moteur d'exécution sont en tension : un LLM n'est pas déterministe.
- Concevoir huit moteurs avant d'avoir généré une seule feature de bout en bout est un risque de sur-ingénierie classique (MDA/low-code des années 2000-2010 a buté sur ce même écueil : le DSL reste trivial ou devient aussi complexe que le code).
- Recommandation initiale : scoper à un générateur déterministe pour le pattern CRUD Angular observé, avec l'IA seulement en périphérie.

Ce scoping (Angular seul, générateur CRUD) a été livré dans `besoin-reformule-SEOS.md` — et corrigé à l'étape suivante.

## Étape 3 — Correction du cadrage par l'utilisateur : problème plus large que Angular

Rejet explicite du cadrage "Angular CRUD Generator". Reformulation : le vrai problème est de capturer une architecture logicielle, indépendamment du langage (Angular, React, Spring Boot, Rust, Solana, Kotlin, Swift). Introduction de l'analogie du compilateur : DSL = langage source, Patterns = bibliothèque standard, Pattern Repository = représentation intermédiaire, générateurs déterministes = backend, IA = enrichissement en périphérie, validateurs = cohérence.

Réponse : cette reformulation est validée comme plus juste. Deux réserves techniques ajoutées :

- L'extraction de patterns par analyse statique sans IA est légitime et précédée (software repository mining, apprentissage de règles par fréquence type Apriori).
- Le vrai risque n'est pas le pipeline mais l'IR : concevoir une représentation assez abstraite pour couvrir des paradigmes qui n'ont rien en commun (DDD/OOP vs ownership Rust vs modèle de comptes Solana). Recommandation : suivre l'analogie du compilateur jusqu'au bout — un seul frontend d'abord (Angular/TypeScript, matière première déjà présente dans le projet), IR conçu générique mais validé sur un cas réel avant généralisation, puis un deuxième frontend délibérément éloigné (Rust ou Solana, pas un autre framework OOP) pour stress-tester l'IR.

## Étape 4 — Raffinement : Intent comme primitive, pas Pattern

Proposition : le Pattern est spécifique au langage (Facade, DTO n'existent pas partout), mais la responsabilité métier sous-jacente (l'Intent : "cette responsabilité orchestre plusieurs cas d'usage") est plus fondamentale. L'IR devrait représenter des Intents, dont les Patterns par langage ne sont que des projections. Renommage proposé : Frontend → Architecture Adapter ; Pattern Repository devient une projection d'un Repository d'Intents.

Réponse : le déplacement Pattern → Intent est validé comme geste correct (rend l'IR robuste aux ruptures de paradigme). Mais gap identifié : un Pattern est un fait structurel observable sans interprétation (fréquence, co-occurrence). Une Intent est un jugement sémantique — le code ne contient pas littéralement "ceci orchestre", quelqu'un l'a décidé. Donc soit l'Intent est une catégorie définie à l'avance par un humain (pas observée), soit elle est inférée automatiquement (ce qui réintroduit de l'IA à l'extraction, contredisant le principe déterministe). Référence apportée : GRASP (Larman) comme vocabulaire de responsabilités déjà existant et indépendant du langage, utilisable comme point de départ curé plutôt qu'inventé. Référence sur les justifications ("pourquoi pas de Facade ici ?") : le champ de la design rationale capture (IBIS, DRL, années 1980) a établi que le "pourquoi" n'est généralement pas récupérable depuis l'artefact final — il doit être capturé au moment de la décision (ADR), pas reconstruit après coup.

## Étape 5 — Deuxième fil ChatGPT : réaction à la critique, nouvelles propositions

L'utilisateur a soumis la critique de l'étape 4 à ChatGPT dans un deuxième fil. Réponse obtenue, avec plusieurs apports substantiels :

- Séparation stricte "connaissance observée" (extraite du code, déterministe) / "connaissance déclarée" (introduite par les architectes : ADR, décisions, vocabulaire) — résout directement le gap sur l'origine du vocabulaire d'Intent.
- Reformulation de la roadmap comme expérience scientifique plutôt que produit : la V1 doit répondre à une seule question (existe-t-il un modèle stable représentant plusieurs architectures sans dépendre d'un framework particulier ?).
- Renommage IR → Canonical Architecture Model (CAM), en référence explicite au vocabulaire des compilateurs jugé trop technique/prématuré.

## Étape 6 — Deuxième critique externe

Points validés sans réserve : la séparation observée/déclarée (résout le gap de l'étape 4) ; le passage en posture d'expérience scientifique (changement le plus important du fil).

Points contestés, avec appui historique :

- L'analogie LLVM est enjolivée : LLVM a appliqué une théorie de quarante ans déjà mûre (SSA, IBM Research, sémantique des CFG) ; l'architecture logicielle n'a pas d'équivalent aussi mature (Perry & Wolf 1992, puis Wright/Acme/Rapide/UniCon/UML — trente ans de tentatives sans convergence universelle).
- Le test de convergence "Angular + Spring" est trop faible : ces deux frameworks partagent une ascendance (DI, culture Java EE/enterprise) — convergence quasi garantie sans rien prouver de fondamental. Un test honnête demande une lignée génétiquement indépendante (Elm, Solana).
- Les modèles indépendants et cloisonnés (Application/Systems/Blockchain/Embedded) risquent de ne jamais converger faute de checkpoint planifié — sans confrontation datée, la théorie unificatrice reste une intention permanente.
- "Jamais mélangées" (observé/déclaré) a besoin d'un mécanisme de lien explicite et traçable, sinon les deux bases s'ignorent.
- "Expérience scientifique" a besoin d'un critère de falsification écrit et opérationnel (seuil chiffré, corpus fixé à l'avance), pas seulement d'une question ouverte.
- Précédent identifié : le Canonical Data Model (Enterprise Integration Patterns, Hohpe & Woolf) valide l'intuition du modèle pivot, mais documente un mode d'échec connu : le modèle finit trop petit (plus petit dénominateur commun) ou trop grand (union de tout), jamais entre les deux.

## Étape 7 — Troisième round ChatGPT : réponses aux objections

L'utilisateur a soumis la critique de l'étape 6 à ChatGPT. Nouvelles propositions reçues, en réponse directe à chaque point contesté :

- Remplacement de l'analogie LLVM par l'analogie Linné (taxonomie) : on ne connaît pas encore les concepts fondamentaux, contrairement à LLVM qui partait de concepts déjà stabilisés (registres, CFG, SSA) — observer, classifier, renommer, découvrir, puis seulement théoriser.
- Introduction des "lignées architecturales" (Enterprise OOP, Functional UI, Systems, Blockchain, Dataflow) comme unité de comparaison, au lieu de comparer deux frameworks d'une même lignée — répond directement à l'objection sur Angular+Spring.
- Rule 0 : un concept ne peut entrer dans le modèle central que s'il apparaît dans au moins deux lignées indépendantes, jamais deux membres de la même lignée.
- Convergence Review trimestrielle — répond directement à l'objection sur l'absence de checkpoint planifié.
- Renommage CAM → Architecture Ontology Candidate (AOC), versionné (v0.1, v0.2...), explicitement qualifié de candidat et non de vérité acquise.
- Research Charter avec Research Question, H0, H1 formulées explicitement.
- Research-Safe Architecture : le projet doit produire de la valeur quel que soit le résultat de l'hypothèse centrale (H0 confirmée → Family Models reliés par correspondances ; H1 confirmée → Core Ontology).

## Étape 8 — Formalisation (ce document + Research Charter)

Évaluation de l'étape 7 : les lignées + Rule 0 + Convergence Review corrigent effectivement les trois objections majeures de l'étape 6. Research-Safe Architecture est jugée comme l'idée la plus solide du fil : la couche de correspondance observé/déclaré n'est pas un filet de sécurité ajouté, c'est la même infrastructure requise que H0 ou H1 se vérifie — rien n'est perdu si l'hypothèse centrale échoue.

Gap restant, comblé dans `SEOS-Research-Charter.md` (§1) : H0/H1 étaient formulées sans protocole de mesure opérationnel (corpus fixé à l'avance, seuil chiffré décidé avant le test). Ajouté explicitement pour que la falsifiabilité soit réelle et non seulement déclarative.

## État actuel des connaissances

| Concept | Statut | Où |
|---|---|---|
| Générateur déterministe pour le pattern CRUD Angular | Validé, scopé, prêt à prototyper | `besoin-reformule-SEOS.md` |
| IA jamais responsable de la structure architecturale | Validé, consensuel depuis l'étape 2 | Research Charter §0, §4 |
| Pattern = fait observable, Intent = jugement déclaré | Validé | Research Charter §4 |
| Mécanisme de lien observé/déclaré (table d'association tracée) | Validé, précisé | Research Charter §4 |
| Lignées architecturales comme unité de comparaison | Validé | Research Charter §2 |
| Rule 0 (promotion au Core après ≥2 lignées indépendantes) | Validé | Research Charter §3 |
| Convergence Review trimestrielle | Validé | Research Charter §5 |
| Research-Safe Architecture | Validé | Research Charter §6 |
| Protocole de falsification opérationnel (corpus + seuil) | Ajouté à cette étape, jamais testé | Research Charter §1 |
| Existence d'un Core Ontology universel (H1) | Ouvert — non testé | Research Charter §1 |
| Corpus de test Functional UI (Elm/Redux réel) | Ouvert — à constituer | Research Charter §8 |
