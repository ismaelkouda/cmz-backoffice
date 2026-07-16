#!/usr/bin/env node
/**
 * SEOS — Pattern conformance checker (Etape "Validation Engine", zero IA).
 *
 * Verifie qu'une entite respecte le pattern CRUD canonique extrait experimentalement
 * de administrative-boundary (voir SEOS-Assumptions-Register.md, Experience 001/003).
 *
 * Usage:
 *   node check-pattern.js <chemin-du-module> <nom-entite>
 *
 * Exemple (verifier une entite existante) :
 *   node check-pattern.js src/presentation/pages/administrative-boundary departments
 *
 * Exemple (verifier une NOUVELLE entite avant de la considerer terminee) :
 *   node check-pattern.js src/presentation/pages/mon-module cities
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const patternPath = path.join(__dirname, '..', 'patterns', 'crud-entity.pattern.json');
const spec = JSON.parse(fs.readFileSync(patternPath, 'utf8'));

const [, , moduleRoot, entityName] = process.argv;

if (!moduleRoot || !entityName) {
    console.error('Usage: node check-pattern.js <chemin-du-module> <nom-entite>');
    process.exit(1);
}

if (!fs.existsSync(moduleRoot)) {
    console.error(
        `Erreur : le chemin "${moduleRoot}" n'existe pas depuis le dossier courant (${process.cwd()}).\n` +
        `Le premier argument doit etre le chemin RELATIF COMPLET vers le dossier du module, par exemple :\n` +
        `  node seos/tools/check-pattern.js src/presentation/pages/administrative-infrastructure infrastructure\n` +
        `(et non juste le nom du module, ex: "administrative-infrastructure")`
    );
    process.exit(2);
}

function resolveTemplate(tpl, entity) {
    return tpl.replace(/\{ENTITY\}/g, entity);
}

const missing = [];
const present = [];

for (const tpl of spec.core_files) {
    const rel = resolveTemplate(tpl, entityName);
    const abs = path.join(moduleRoot, rel);
    if (fs.existsSync(abs)) {
        present.push(rel);
    } else {
        missing.push(rel);
    }
}

const total = spec.core_files.length;
const score = ((present.length / total) * 100).toFixed(1);

console.log(`SEOS — verification du pattern "${spec.pattern}" (${spec.lineage})`);
console.log(`Module : ${moduleRoot}`);
console.log(`Entite : ${entityName}`);
console.log(`Conformite : ${present.length}/${total} fichiers du coeur CRUD presents (${score}%)`);

if (missing.length > 0) {
    console.log(`\nFichiers manquants (${missing.length}) :`);
    for (const m of missing) {
        console.log(`  - ${m}`);
    }
    process.exitCode = 1;
} else {
    console.log('\nAucun fichier du coeur CRUD manquant.');
}

console.log(
    `\nNote : ce script ne verifie que la PRESENCE des fichiers (Pattern, fait structurel), jamais leur contenu ni une "Intent" metier — conformement a la separation connaissance observee / declaree (SEOS-Research-Charter.md, section 4). Deviation connue du schema : ${spec.known_deviation}`
);
