#!/usr/bin/env node
/**
 * SEOS — Compilateur DSL → feature Angular (patterns crud-entity | action-request)
 *
 * Usage:
 *   node seos/tools/compile-dsl.js <feature.yaml>
 *   node seos/tools/compile-dsl.js <feature.yaml> --out src/presentation/pages/<module>
 *   node seos/tools/compile-dsl.js <feature.yaml> --dry-run
 *   node seos/tools/compile-dsl.js <feature.yaml> --check
 *
 * Pipeline:
 *   1. Parse + valide le YAML DSL
 *   2. Sélectionne le pattern (auto | crud-entity | action-request)
 *   3. Produit une config générateur
 *   4. Appelle le générateur déterministe correspondant
 *   5. Optionnel: check-pattern + tsc
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseFeatureFile, selectPattern } from './dsl/parse.js';
import { toGeneratorConfig } from './dsl/to-generator-config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const PAGES_ROOT = path.join(REPO_ROOT, 'src', 'presentation', 'pages');

const args = process.argv.slice(2);
const dslPath = args.find((a) => a && !a.startsWith('--'));
const dryRun = args.includes('--dry-run');
const runCheck = args.includes('--check');
const outIdx = args.indexOf('--out');
const outOverride = outIdx >= 0 ? args[outIdx + 1] : null;

if (!dslPath) {
    console.error(`Usage: node seos/tools/compile-dsl.js <feature.yaml> [--out dir] [--dry-run] [--check]

Exemples:
  node seos/tools/compile-dsl.js seos/dsl/examples/reports.feature.yaml --check
  node seos/tools/compile-dsl.js seos/dsl/examples/submit-report.feature.yaml --check
`);
    process.exit(1);
}

const feature = parseFeatureFile(path.resolve(dslPath));
const pattern = selectPattern(feature);
const config = toGeneratorConfig(feature);

const outDir = outOverride
    ? path.resolve(outOverride)
    : path.join(PAGES_ROOT, config.module);

console.log('── SEOS DSL compile ──');
console.log(`  source   : ${feature.source}`);
console.log(`  feature  : ${feature.feature.name} (${config.entity})`);
console.log(`  pattern  : ${pattern}`);
console.log(`  module   : ${config.module}`);
console.log(`  fields   : ${config.fields.map((f) => f.name).join(', ')}`);
console.log(`  filters  : ${config.filters.map((f) => f.name).join(', ') || '(none)'}`);
console.log(`  api      : ${config.apiBase}`);
console.log(`  out      : ${outDir}`);
if (config.extensions.map) console.log(`  ext.map  : ${config.extensions.map} (TODO stub)`);
if (config.extensions.attachmentsUpload)
    console.log(`  ext.file : attachments upload (TODO stub)`);

if (dryRun) {
    console.log('\n--dry-run: aucune génération.');
    console.log(JSON.stringify(config, null, 2));
    process.exit(0);
}

// Config JSON temporaire pour le générateur
const tmpDir = path.join(REPO_ROOT, 'seos', '.tmp');
fs.mkdirSync(tmpDir, { recursive: true });
const configFile = path.join(tmpDir, `${config.entity}.gen.json`);

const genConfig =
    pattern === 'crud-entity'
        ? {
              entity: config.entity,
              entityCap: config.entityCap,
              entityUpper: config.entityUpper,
              module: config.module,
              moduleCap: config.moduleCap,
              moduleUpper: config.moduleUpper,
              fields: config.fields.map((f) => ({
                  name: f.name,
                  required: f.required !== false,
                  type: f.type,
              })),
              filters: config.filters
                  .map((f) => f.name)
                  .filter((n) => !['search', 'startDate', 'endDate'].includes(n)),
              apiBase: config.apiBase,
              description: config.description,
              extensions: config.extensions,
              sourceDsl: config.sourceDsl,
          }
        : {
              operation: config.entity,
              operationCap: config.entityCap,
              operationUpper: config.entityUpper,
              module: config.module,
              moduleCap: config.moduleCap,
              moduleUpper: config.moduleUpper,
              fields: config.fields.map((f) => ({
                  name: f.name,
                  required: f.required !== false,
                  type: f.type,
              })),
              apiBase: config.apiBase,
              description: config.description,
              extensions: config.extensions,
              sourceDsl: config.sourceDsl,
          };

fs.writeFileSync(configFile, JSON.stringify(genConfig, null, 2));

// Nettoyer la destination si elle existe (régénération)
if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
}

if (pattern === 'crud-entity') {
    const r = spawnSync(
        process.execPath,
        [
            path.join(__dirname, 'generate-reference-module.js'),
            outDir,
            '--config',
            configFile,
        ],
        { cwd: REPO_ROOT, encoding: 'utf8', stdio: 'inherit' }
    );
    if (r.status !== 0) process.exit(r.status || 1);
} else {
    const r = spawnSync(
        process.execPath,
        [
            path.join(__dirname, 'generate-action-request-module.js'),
            '--config',
            configFile,
            '--out',
            outDir,
        ],
        { cwd: REPO_ROOT, encoding: 'utf8', stdio: 'inherit' }
    );
    if (r.status !== 0) process.exit(r.status || 1);
}

const fileCount = countFiles(outDir);
console.log(`\n✓ Généré: ${fileCount} fichiers`);

if (runCheck) {
    console.log('\n── check-pattern ──');
    const schema =
        pattern === 'crud-entity'
            ? path.join(REPO_ROOT, 'seos/patterns/crud-entity.pattern.json')
            : path.join(REPO_ROOT, 'seos/patterns/action-request.pattern.json');
    const unit = config.entity;
    const cp = spawnSync(
        process.execPath,
        [
            path.join(__dirname, 'check-pattern.js'),
            outDir,
            unit,
            '--schema',
            schema,
        ],
        { cwd: REPO_ROOT, encoding: 'utf8', stdio: 'inherit' }
    );

    console.log('\n── tsc --noEmit ──');
    const tsc = spawnSync('npx', ['tsc', '-p', 'tsconfig.app.json', '--noEmit'], {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        stdio: 'inherit',
        shell: true,
    });

    if (cp.status !== 0 || tsc.status !== 0) {
        console.error('\n✗ Validation échouée');
        process.exit(1);
    }
    console.log('\n✓ Validation OK (structure + compilation)');
}

console.log(`
Prochaines étapes:
  - Module NON branché aux routes (comme seos-reference) — volontaire
  - Pour brancher: importer provide${config.moduleCap}() dans app.config + routes
  - Nettoyage: rm -rf ${path.relative(REPO_ROOT, outDir)}
`);

function countFiles(dir) {
    let n = 0;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) n += countFiles(full);
        else n += 1;
    }
    return n;
}
