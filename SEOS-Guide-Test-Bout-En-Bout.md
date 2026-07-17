# SEOS — Guide de test de bout en bout (module de référence)

Statut : procédure opérationnelle, pas un document de recherche. Décrit comment rejouer, à la main, le cycle complet validé en Expérience 042 (`SEOS-Assumptions-Register.md`) : extraction → Pattern Repository → génération déterministe → validation. Périmètre fixé par `besoin-reformule-SEOS.md` (addendum du 2026-07-16) : **le seul module testé est `administrative-infrastructure`**, pas le reste de l'application.

## Ce que ce test prouve, et ce qu'il ne prouve pas

Prouve : que le Pattern Repository (`seos/patterns/crud-entity.pattern.json`) reste fidèle à `administrative-infrastructure`, et que `generate-reference-module.js` produit, à partir de ce schéma, un module Angular qui compile, respecte le pattern structurel (`check-pattern.js`) et les règles sémantiques mécaniques (`check-semantics.js`).

Ne prouve pas : que les autres modules du projet suivent la même convention (ils ne sont plus un objectif d'étape 2), ni que l'IR généralise à un autre langage ou une autre structure de projet (étape 4, non commencée), ni un comportement runtime (aucun test e2e navigateur n'est joué ici).

## Prérequis

- Être à la racine du dépôt (`package.json`, `seos/`, `src/` visibles).
- `node` et les dépendances npm du projet déjà installées (`node_modules` présent).
- Aucune modification non commitée dans `src/presentation/pages/administrative-infrastructure` ou `seos/patterns/crud-entity.pattern.json` que vous ne voulez pas voir influencer le test (le test lit l'état réel du disque, pas une version figée).

## Étape 0 — État propre

Vérifier qu'aucun résidu d'un test précédent ne traîne (ça s'est déjà produit — un répertoire `seos-reference/` oublié, non suivi par git) :

```bash
git status --short src/presentation/pages/seos-reference
```

Doit être vide. Sinon :

```bash
rm -rf src/presentation/pages/seos-reference
```

## Étape 1 — Extraction (le schéma est-il toujours fidèle au module de référence ?)

```bash
node seos/tools/extract-pattern.js
```

Ce script ne modifie jamais `crud-entity.pattern.json` — c'est un rapport d'observation pur, jamais une écriture automatique. À lire dans la sortie :

- `administrative-infrastructure/infrastructure` et `administrative-infrastructure/infrastructure-type` doivent apparaître dans la liste des entités « à mutation réelle ».
- Section « Frequence restreinte au sous-corpus mutation » : les chemins marqués `[schema]` doivent rester à un pourcentage élevé (94–100 % lors du dernier run) — une chute nette signalerait que le schéma a divergé du code réel.
- Section « Candidats absents du schema mais fréquents » : doit rester vide ou ne contenir que des cas déjà documentés comme exclusions délibérées (voir `design_decisions_v9`/`v15` dans `crud-entity.pattern.json`). Un nouveau candidat non documenté ici est un signal à investiguer, pas à ignorer.

## Étape 2 — Génération déterministe

```bash
node seos/tools/generate-reference-module.js src/presentation/pages/seos-reference
```

Génère une entité synthétique `resources` (100 fichiers attendus) sous `src/presentation/pages/seos-reference`, sur le patron exact d'`administrative-infrastructure`. Vérifier le compte :

```bash
find src/presentation/pages/seos-reference -type f | wc -l
```

## Étape 3 — Validation structurelle (présence de fichiers)

```bash
node seos/tools/check-pattern.js src/presentation/pages/seos-reference resources
```

Attendu : `96/96 fichiers du coeur CRUD presents (100.0%)`. Ce script ne vérifie que la présence, jamais le contenu — une conformité à 100 % ne dispense pas des étapes suivantes.

## Étape 4 — Validation sémantique (règles mécaniques)

```bash
node seos/tools/check-semantics.js src/presentation/pages/seos-reference resources
```

9 règles vérifiées (defer(), clés i18n, DomainError→UiFeedbackService, Validators.required vs validator domaine, artefacts orphelins, cérémonie VO/Entity, nommage select-response-api.dto, chaînage VO→Entity, résidus console.*). Sur un module généré à but de test, deux findings sont **attendus et sans gravité** :

- Clés i18n absentes de `fr.json` (`SEOS_REFERENCE.RESOURCES.FORM.ERROR...`) — normal, le module de test n'a pas de traductions.
- `ResourcesFindOneFacade`/`ResourcesSelectFacade` signalées comme non consommées — normal, aucun composant de test ne les appelle.

Tout autre finding (règles 1, 3, 4, 6, 8, 9 en particulier) est anormal et doit être traité comme une régression du générateur, pas ignoré.

## Étape 5 — Compilation TypeScript (app entière)

```bash
npx tsc -p tsconfig.app.json --noEmit
```

Attendu : 0 erreur. Se lance sur l'application entière (le module généré est inclus dans `src/`), donc ça vérifie aussi qu'aucune régression n'a été introduite ailleurs par inadvertance. Peut prendre 15–20 secondes.

## Étape 6 — Lint

```bash
npx eslint "src/presentation/pages/seos-reference/**/*.ts"
```

Le générateur écrit des template strings brutes, pas pré-formatées selon les règles prettier exactes (retours à la ligne sur signatures longues) — des erreurs `prettier/prettier` à ce stade sont normales, pas un bug du générateur. Corriger automatiquement puis revérifier :

```bash
npx eslint "src/presentation/pages/seos-reference/**/*.ts" --fix
npx eslint "src/presentation/pages/seos-reference/**/*.ts"
```

Attendu après `--fix` : 0 erreur, 0 warning.

## Étape 7 — Nettoyage (obligatoire avant de commit quoi que ce soit)

```bash
rm -rf src/presentation/pages/seos-reference
git status --short src/presentation/pages/seos-reference
```

La deuxième commande doit ne rien afficher. Le module généré est un artefact de test jetable — il ne doit jamais être commité.

## Checklist de succès

Le pipeline est considéré validé si, dans l'ordre : le schéma reste fidèle au corpus observé (étape 1), la génération produit bien 100 fichiers (étape 2), `check-pattern.js` rapporte 100 % (étape 3), `check-semantics.js` ne rapporte que les 2 findings attendus (étape 4), `tsc` rapporte 0 erreur (étape 5), `eslint --fix` ramène à 0 erreur (étape 6), et le répertoire de test est bien supprimé avant tout commit (étape 7).

## En cas d'échec

Un échec à l'étape 1 (schéma qui diverge) ou 3/4/5/6 (fichier généré non conforme) signale une régression soit dans `crud-entity.pattern.json`, soit dans `generate-reference-module.js`, soit dans le code réel d'`administrative-infrastructure` qui a changé sans que le schéma suive. Ne pas corriger le symptôme (ex. modifier le générateur pour faire taire une erreur) sans d'abord vérifier lequel des trois (schéma, générateur, code réel) est la source de vérité qui a bougé — c'est la même discipline que pour toute autre Expérience du projet (voir `SEOS-Assumptions-Register.md`).

## Dernière exécution vérifiée

Expérience 042 (2026-07-16) — cycle complet exécuté et documenté intégralement, aucune anomalie hors les 2 findings attendus à l'étape 4 et les erreurs prettier attendues à l'étape 6.
