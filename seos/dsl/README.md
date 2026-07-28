# SEOS DSL — Feature → Angular

Compile un fichier YAML de feature en module Angular complet, via les patterns SEOS existants.

## Usage

```bash
# CRUD (list/create/edit/delete)
node seos/tools/compile-dsl.js seos/dsl/examples/reports.feature.yaml --check

# Action unique (fire-and-forget)
node seos/tools/compile-dsl.js seos/dsl/examples/submit-report.feature.yaml --check

# Dry-run (affiche la config, ne génère rien)
node seos/tools/compile-dsl.js seos/dsl/examples/reports.feature.yaml --dry-run

# npm scripts
bun run seos:compile:reports
bun run seos:compile:submit
```

## Sélection de pattern

| capabilities | pattern |
|---|---|
| `list`, `create`, `edit`, `delete`, `details`… | `crud-entity` |
| `action` seul | `action-request` |
| `architecture.pattern: crud-entity \| action-request` | forcé |

## Périmètre v1

**Généré et vérifié** : structure complète du pattern (domain/application/infrastructure/presentation), champs dynamiques, filtres, API base, validators, forms keys, check-pattern 100 %, tsc 0 erreur.

**Stubs / TODO** (métadonnées dans `seos.feature.meta.json`) :
- carte OpenLayers
- upload pièces jointes
- UI PrimeNG riche (list/form restent génériques)

**Non branché aux routes** par design (comme `seos-reference`) — brancher manuellement via `provide{Module}()` + routes.

## Nettoyage des modules de test

```bash
rm -rf src/presentation/pages/seos-dsl-reports
rm -rf src/presentation/pages/seos-dsl-actions
```
