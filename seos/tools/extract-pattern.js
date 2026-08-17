#!/usr/bin/env node
/**
 * SEOS — Pattern Extraction Engine (Etape "Frontend Angular/TS", Experience 037).
 *
 * Premiere automatisation reelle de l'extraction, telle que demandee par
 * besoin-reformule-SEOS.md section 4.2 ("ts-morph pour parser l'AST, construction d'un
 * graphe de dependances par entite, extraction de la signature structurelle"). Jusqu'ici
 * (Experiences 001-035), crud-entity.pattern.json a ete construit et mis a jour par
 * lecture humaine (assistee IA) fichier par fichier, jamais par un mineur automatique.
 * Ce script comble cet ecart : il decouvre les entites CRUD reelles du projet par un
 * signal structurel (repository abstrait + entite principale presents), parse chaque
 * fichier via l'API du compilateur TypeScript (zero regex, zero IA), et calcule :
 *
 *   1. La liste normalisee des fichiers de chaque entite ({ENTITY} substitue au nom reel).
 *   2. La frequence d'apparition de chaque chemin normalise a travers toutes les entites
 *      decouvertes (apprentissage de regles par frequence, cf. besoin-reformule-SEOS.md
 *      section 2 — type Apriori, pas du machine learning au sens flou). Le denominateur
 *      est lui-meme corrige en cours de route (Experience 037) : melanger les entites a
 *      mutation reelle (create/update/delete) avec des entites en lecture seule (tableaux
 *      de bord, journaux) faussait toute frequence liee a create/update/delete (44% au
 *      lieu de 100% une fois le sous-corpus pertinent isole) — le script calcule donc les
 *      deux tables, brute et restreinte au sous-corpus a mutation.
 *   3. Une empreinte structurelle legere par fichier (declaration exportee, decorateurs,
 *      extends/implements, imports) pour les familles de fichiers les plus significatives
 *      (repository, mapper, facade), permettant de detecter des incoherences reelles
 *      (ex : deux repositories du meme role sans le meme decorateur) sans avoir a relire
 *      chaque fichier a la main.
 *
 * IMPORTANT — perimetre et limites assumes, pour eviter le contre-sens deja identifie et
 * corrige plusieurs fois cette session (Experience 029 et suivantes) :
 *   - Ce script NE MODIFIE JAMAIS crud-entity.pattern.json. Il produit un RAPPORT
 *     d'observation (signal), jamais une decision. La regle etablie reste : les
 *     conventions du module de reference viennent de la documentation, d'une recherche
 *     verifiee, ou d'une decision explicite d'architecte ancree sur le module de
 *     reference lui-meme — JAMAIS d'un comptage/vote majoritaire sur un corpus dont
 *     l'heterogeneite est deja actee (voir SEOS-Research-Charter.md et de nombreuses
 *     Experiences du registre). La frequence calculee ici est une INFORMATION a
 *     soumettre a l'architecte, pas un verdict a executer aveuglement.
 *   - La decouverte d'entites CRUD par signal structurel (repository + entite) est une
 *     heuristique : elle peut inclure des faux positifs (entites qui ressemblent a du
 *     CRUD sans en etre) ou manquer des variantes non standard. A verifier au cas par
 *     cas avant toute decision qui en dependrait.
 *
 * Usage :
 *   node seos/tools/extract-pattern.js                    (scan complet, rapport de frequence)
 *   node seos/tools/extract-pattern.js --fingerprint <famille>   (ex: repository, mapper, facade)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const PAGES_ROOT = path.join(REPO_ROOT, 'src', 'presentation', 'pages');
const SCHEMA_PATH = path.join(__dirname, '..', 'patterns', 'crud-entity.pattern.json');

function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, out);
        } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
            out.push(full);
        }
    }
    return out;
}

// ---------------------------------------------------------------------
// 1. Decouverte des entites CRUD reelles par signal structurel
//    (repository abstrait principal + entite principale presents)
// ---------------------------------------------------------------------
function discoverEntities() {
    const modules = fs
        .readdirSync(PAGES_ROOT, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name);

    const found = [];
    for (const moduleName of modules) {
        const moduleRoot = path.join(PAGES_ROOT, moduleName);
        const repoRoot = path.join(moduleRoot, 'domain', 'repositories');
        if (!fs.existsSync(repoRoot)) continue;

        const entityDirs = fs
            .readdirSync(repoRoot, { withFileTypes: true })
            .filter((e) => e.isDirectory())
            .map((e) => e.name);

        for (const entityName of entityDirs) {
            const repoDir = path.join(repoRoot, entityName);
            const candidateRepoFiles = [
                `${entityName}.repository.ts`,
                `${entityName}-repository.ts`,
            ];
            const repoFile = candidateRepoFiles
                .map((f) => path.join(repoDir, f))
                .find((f) => fs.existsSync(f));
            if (!repoFile) continue;

            const entityFile = path.join(
                moduleRoot,
                'domain',
                'entities',
                entityName,
                `${entityName}.entity.ts`
            );
            if (!fs.existsSync(entityFile)) continue;

            // Signal supplementaire : le repository doit exposer au moins une methode
            // "execute" ou "readAll" retournant un Observable — evite les faux positifs
            // (repositories d'un seul objet, sans liste paginee).
            const repoSrc = fs.readFileSync(repoFile, 'utf8');
            if (!/execute\s*\(|readAll\s*\(/.test(repoSrc)) continue;

            // Signal de mutation reelle : existence d'un VO de creation. Decouvert par ce
            // script lui-meme (pas suppose a l'avance) : le corpus contient un sous-ensemble
            // d'entites "lecture seule" (repository execute/readAll sans aucune mutation,
            // ex : tableaux de bord, journaux) qui ne sont PAS des entites CRUD au sens du
            // schema — les melanger dans le meme denominateur fausse toute frequence liee a
            // create/update/delete. Voir le rapport en deux tables plus bas.
            const hasMutation =
                fs.existsSync(
                    path.join(
                        moduleRoot,
                        'domain',
                        'value-objects',
                        entityName,
                        `${entityName}-create.vo.ts`
                    )
                ) ||
                fs.existsSync(
                    path.join(
                        moduleRoot,
                        'domain',
                        'value-objects',
                        entityName,
                        `${entityName}-create-vo.ts`
                    )
                );

            found.push({ moduleName, entityName, moduleRoot, hasMutation });
        }
    }
    return found;
}

// ---------------------------------------------------------------------
// 2. Liste de fichiers normalisee par entite (segment de chemin exact,
//    meme logique que check-semantics.js regle 9 pour eviter les collisions
//    du type infrastructure vs infrastructure-type)
// ---------------------------------------------------------------------
function filesForEntity(moduleRoot, entityName) {
    const all = walk(moduleRoot);
    const scoped = all.filter((f) => {
        const rel = path.relative(moduleRoot, f);
        const segments = rel.split(path.sep);
        return segments.includes(entityName);
    });
    return scoped.map((f) => {
        const rel = path.relative(moduleRoot, f).split(path.sep).join('/');
        // Remplace le nom d'entite (segment de dossier ou prefixe de fichier) par {ENTITY}
        const normalized = rel
            .split('/')
            .map((seg) => (seg === entityName ? '{ENTITY}' : seg))
            .join('/')
            .replace(new RegExp(`(^|/)${entityName}([.-])`, 'g'), '$1{ENTITY}$2');
        return { abs: f, rel, normalized };
    });
}

// ---------------------------------------------------------------------
// 3. Empreinte structurelle legere par fichier, via l'API TypeScript (AST reel)
// ---------------------------------------------------------------------
function fingerprint(absPath) {
    const text = fs.readFileSync(absPath, 'utf8');
    const sf = ts.createSourceFile(absPath, text, ts.ScriptTarget.Latest, true);

    const result = {
        exportedKind: null,
        exportedName: null,
        decorators: [],
        extends: null,
        implements: [],
        imports: [],
        methodNames: [],
    };

    for (const stmt of sf.statements) {
        if (ts.isImportDeclaration(stmt) && stmt.moduleSpecifier && ts.isStringLiteral(stmt.moduleSpecifier)) {
            result.imports.push(stmt.moduleSpecifier.text);
            continue;
        }

        const modifiers = ts.canHaveModifiers(stmt) ? ts.getModifiers(stmt) : undefined;
        const isExported = !!modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
        if (!isExported) continue;

        if (ts.isClassDeclaration(stmt)) {
            result.exportedKind = 'class';
            result.exportedName = stmt.name?.text ?? null;
            const decorators = ts.canHaveDecorators(stmt) ? ts.getDecorators(stmt) : undefined;
            for (const d of decorators ?? []) {
                const expr = d.expression;
                const callee = ts.isCallExpression(expr) ? expr.expression : expr;
                result.decorators.push(callee.getText(sf));
            }
            for (const clause of stmt.heritageClauses ?? []) {
                const names = clause.types.map((t) => t.expression.getText(sf));
                if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                    result.extends = names[0] ?? null;
                } else if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
                    result.implements.push(...names);
                }
            }
            for (const member of stmt.members) {
                if (ts.isMethodDeclaration(member) && member.name && ts.isIdentifier(member.name)) {
                    result.methodNames.push(member.name.text);
                }
            }
        } else if (ts.isFunctionDeclaration(stmt)) {
            result.exportedKind = 'function';
            result.exportedName = stmt.name?.text ?? null;
        } else if (ts.isInterfaceDeclaration(stmt)) {
            result.exportedKind = 'interface';
            result.exportedName = stmt.name.text;
        } else if (ts.isTypeAliasDeclaration(stmt)) {
            result.exportedKind = 'type';
            result.exportedName = stmt.name.text;
        } else if (ts.isVariableStatement(stmt)) {
            result.exportedKind = 'const';
            result.exportedName = stmt.declarationList.declarations
                .map((d) => (ts.isIdentifier(d.name) ? d.name.text : null))
                .filter(Boolean)[0] ?? null;
        }
    }

    return result;
}

// ---------------------------------------------------------------------
// main
// ---------------------------------------------------------------------
function main() {
    const args = process.argv.slice(2);
    const fpIndex = args.indexOf('--fingerprint');
    const fpFamily = fpIndex !== -1 ? args[fpIndex + 1] : null;

    const entities = discoverEntities();
    const mutationEntities = entities.filter((e) => e.hasMutation);
    const readOnlyEntities = entities.filter((e) => !e.hasMutation);

    console.log('SEOS — Pattern Extraction Engine (Experience 036, zero regex, zero IA, AST reel)');
    console.log(`Entites decouvertes par signal structurel (repository execute/readAll) : ${entities.length}`);
    console.log(`  dont avec mutation reelle (create.vo present)      : ${mutationEntities.length}`);
    console.log(`  dont lecture seule (aucun create.vo — pas du CRUD) : ${readOnlyEntities.length}`);
    console.log('');
    console.log('Entites avec mutation (le vrai denominateur du pattern CRUD create/update/delete) :');
    for (const e of mutationEntities) {
        console.log(`  - ${e.moduleName}/${e.entityName}`);
    }
    console.log('Entites lecture seule (exclues du denominateur CRUD, decouverte de ce script) :');
    for (const e of readOnlyEntities) {
        console.log(`  - ${e.moduleName}/${e.entityName}`);
    }
    console.log('');

    // --- Frequence des chemins normalises ---
    const freq = new Map(); // normalized -> count (sur toutes les entites)
    const freqMutation = new Map(); // normalized -> count (sur les entites CRUD reelles uniquement)
    const perEntityFiles = new Map(); // "module/entity" -> [{normalized, abs}]

    for (const e of entities) {
        const files = filesForEntity(e.moduleRoot, e.entityName);
        perEntityFiles.set(`${e.moduleName}/${e.entityName}`, files);
        const seenInThisEntity = new Set();
        for (const f of files) {
            if (seenInThisEntity.has(f.normalized)) continue; // 1 occurrence max par entite
            seenInThisEntity.add(f.normalized);
            freq.set(f.normalized, (freq.get(f.normalized) ?? 0) + 1);
            if (e.hasMutation) {
                freqMutation.set(f.normalized, (freqMutation.get(f.normalized) ?? 0) + 1);
            }
        }
    }

    const total = entities.length;
    const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
    const schemaSet = new Set(schema.core_files);

    console.log(`--- Frequence des chemins normalises (sur ${total} entites decouvertes) ---`);
    console.log('(rapport d\'observation — ne modifie jamais le schema, voir docstring de tete)');
    console.log('');

    const missingFromSchemaHighFreq = [];
    const inSchemaLowFreq = [];

    for (const [normalized, count] of sorted) {
        const pct = Math.round((count / total) * 100);
        const inSchema = schemaSet.has(normalized);
        const marker = inSchema ? '[schema]' : '        ';
        if (pct >= 90) {
            console.log(`  ${String(pct).padStart(3)}% (${count}/${total}) ${marker} ${normalized}`);
        }
        if (!inSchema && pct >= 80) {
            missingFromSchemaHighFreq.push({ normalized, pct, count });
        }
        if (inSchema && pct < 50) {
            inSchemaLowFreq.push({ normalized, pct, count });
        }
    }

    console.log('');
    console.log(`--- Candidats absents du schema mais frequents (>= 80% des ${total} entites) ---`);
    if (missingFromSchemaHighFreq.length === 0) {
        console.log('  Aucun. Le schema couvre deja tous les chemins tres frequents observes.');
    } else {
        for (const c of missingFromSchemaHighFreq) {
            console.log(`  ${c.pct}% (${c.count}/${total}) — ${c.normalized}`);
        }
    }

    console.log('');
    console.log(`--- Entrees du schema peu representees dans le corpus observe (< 50% des ${total} entites) ---`);
    console.log('  (INFORMATIF SEULEMENT : le schema est ancre sur le module de reference par decision');
    console.log('   d\'architecte, pas sur une majorite corpus — une faible frequence ici ne remet pas en');
    console.log('   cause l\'entree, elle documente juste que le reste du corpus est heterogene.)');
    if (inSchemaLowFreq.length === 0) {
        console.log('  Aucune.');
    } else {
        for (const c of inSchemaLowFreq) {
            console.log(`  ${c.pct}% (${c.count}/${total}) — ${c.normalized}`);
        }
    }

    // --- Deuxieme table : frequence restreinte aux entites a mutation reelle ---
    // Corrige le denominateur trompeur de la table precedente : les chemins create/update/
    // delete y semblaient rares (~44%) uniquement parce que le denominateur (39) melangeait
    // des entites en lecture seule (jamais candidates a create/update) avec les vraies
    // entites CRUD. Restreint au sous-corpus pertinent (mutationEntities.length), la mesure
    // devient significative.
    const totalM = mutationEntities.length;
    const sortedM = [...freqMutation.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const missingFromSchemaHighFreqM = [];
    const inSchemaLowFreqM = [];

    console.log('');
    console.log(
        `--- Frequence restreinte aux ${totalM} entites a mutation reelle (denominateur corrige) ---`
    );
    for (const [normalized, count] of sortedM) {
        const pct = Math.round((count / totalM) * 100);
        const inSchema = schemaSet.has(normalized);
        const marker = inSchema ? '[schema]' : '        ';
        if (pct >= 90) {
            console.log(`  ${String(pct).padStart(3)}% (${count}/${totalM}) ${marker} ${normalized}`);
        }
        if (!inSchema && pct >= 80) {
            missingFromSchemaHighFreqM.push({ normalized, pct, count });
        }
        if (inSchema && pct < 50) {
            inSchemaLowFreqM.push({ normalized, pct, count });
        }
    }

    console.log('');
    console.log(
        `--- (sous-corpus mutation) Candidats absents du schema mais frequents (>= 80% des ${totalM}) ---`
    );
    if (missingFromSchemaHighFreqM.length === 0) {
        console.log('  Aucun.');
    } else {
        for (const c of missingFromSchemaHighFreqM) {
            console.log(`  ${c.pct}% (${c.count}/${totalM}) — ${c.normalized}`);
        }
    }

    console.log('');
    console.log(
        `--- (sous-corpus mutation) Entrees du schema peu representees (< 50% des ${totalM}) ---`
    );
    if (inSchemaLowFreqM.length === 0) {
        console.log('  Aucune.');
    } else {
        for (const c of inSchemaLowFreqM) {
            console.log(`  ${c.pct}% (${c.count}/${totalM}) — ${c.normalized}`);
        }
    }

    // --- Empreinte structurelle sur une famille de fichiers (optionnel) ---
    if (fpFamily) {
        console.log('');
        console.log(`--- Empreinte structurelle (AST) : famille "*${fpFamily}*" ---`);
        for (const [key, files] of perEntityFiles.entries()) {
            const match = files.find((f) => path.basename(f.abs).includes(fpFamily));
            if (!match) continue;
            const fp = fingerprint(match.abs);
            console.log(
                `  ${key.padEnd(35)} ${path.basename(match.abs).padEnd(40)} ` +
                    `kind=${fp.exportedKind ?? '?'} decorators=[${fp.decorators.join(',')}] ` +
                    `extends=${fp.extends ?? '-'} methods=[${fp.methodNames.join(',')}]`
            );
        }
    }
}

main();
