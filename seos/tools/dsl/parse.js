import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';
import { toKebab } from './naming.js';

const CRUD_CAPS = new Set(['list', 'details', 'create', 'edit', 'delete', 'select']);
const ACTION_CAPS = new Set(['action']);

/**
 * Parse un fichier .yaml/.yml/.json de feature SEOS.
 * Valide les champs minimaux (sans dépendance ajv — validation manuelle stricte).
 */
export function parseFeatureFile(filePath) {
    const abs = path.resolve(filePath);
    if (!fs.existsSync(abs)) {
        throw new Error(`Fichier DSL introuvable: ${abs}`);
    }
    const raw = fs.readFileSync(abs, 'utf8');
    const ext = path.extname(abs).toLowerCase();
    const doc = ext === '.json' ? JSON.parse(raw) : parseYaml(raw);
    return normalizeAndValidate(doc, abs);
}

function normalizeAndValidate(doc, source) {
    if (!doc || typeof doc !== 'object') {
        throw new Error(`${source}: document DSL invalide (objet attendu)`);
    }
    if (!doc.feature?.name) {
        throw new Error(`${source}: feature.name est requis`);
    }
    if (!Array.isArray(doc.capabilities) || doc.capabilities.length === 0) {
        throw new Error(`${source}: capabilities[] est requis (au moins 1)`);
    }

    const caps = doc.capabilities.map((c) => String(c).toLowerCase());
    const unknown = caps.filter((c) => !CRUD_CAPS.has(c) && !ACTION_CAPS.has(c));
    if (unknown.length) {
        throw new Error(`${source}: capabilities inconnues: ${unknown.join(', ')}`);
    }

    const name = String(doc.feature.name);
    const slug = toKebab(doc.feature.slug || name);
    const module = toKebab(doc.feature.module || `seos-dsl-${slug}`);

    const fields = normalizeFields(doc.fields, caps, source);
    const filters = normalizeFilters(doc.filters);

    return {
        source,
        feature: {
            name,
            slug,
            module,
            description: String(doc.feature.description || '').trim(),
        },
        actors: Array.isArray(doc.actors) ? doc.actors.map(String) : [],
        capabilities: caps,
        fields,
        search: {
            fullText: Boolean(doc.search?.fullText),
        },
        filters,
        pagination: doc.pagination !== false,
        sorting: Boolean(doc.sorting),
        attachments: {
            upload: Boolean(doc.attachments?.upload),
        },
        location: {
            map: doc.location?.map ? String(doc.location.map) : null,
        },
        api: {
            base: String(doc.api?.base || `/${slug}`),
        },
        architecture: {
            style: String(doc.architecture?.style || 'ddd'),
            pattern: String(doc.architecture?.pattern || 'auto').toLowerCase(),
        },
        ui: {
            framework: String(doc.ui?.framework || 'primeng'),
        },
    };
}

function normalizeFields(fields, caps, source) {
    if (Array.isArray(fields) && fields.length > 0) {
        return fields.map((f, i) => {
            if (!f?.name || !f?.type) {
                throw new Error(`${source}: fields[${i}] requiert name et type`);
            }
            const type = String(f.type);
            if (type === 'enum' && (!Array.isArray(f.values) || f.values.length === 0)) {
                throw new Error(`${source}: fields[${i}] type enum requiert values[]`);
            }
            return {
                name: String(f.name),
                type,
                required: f.required === undefined ? true : Boolean(f.required),
                values: Array.isArray(f.values) ? f.values.map(String) : undefined,
            };
        });
    }

    if (caps.includes('action') && caps.every((c) => ACTION_CAPS.has(c))) {
        return [
            { name: 'identifier', type: 'string', required: true },
            { name: 'secret', type: 'string', required: true },
        ];
    }
    return [
        { name: 'code', type: 'string', required: true },
        { name: 'name', type: 'string', required: true },
        { name: 'description', type: 'text', required: false },
    ];
}

function normalizeFilters(filters) {
    if (!Array.isArray(filters)) return [];
    return filters.map((f) => {
        if (typeof f === 'string') {
            return { name: f, type: 'string' };
        }
        return {
            name: String(f.name),
            type: String(f.type || 'string'),
        };
    });
}

/**
 * Sélectionne le pattern SEOS à partir du DSL normalisé.
 */
export function selectPattern(feature) {
    const forced = feature.architecture.pattern;
    if (forced === 'crud-entity' || forced === 'action-request') {
        return forced;
    }

    const caps = feature.capabilities;
    const hasActionOnly = caps.length > 0 && caps.every((c) => ACTION_CAPS.has(c));
    if (hasActionOnly) return 'action-request';

    const hasCrud = caps.some((c) => CRUD_CAPS.has(c));
    if (hasCrud) return 'crud-entity';

    throw new Error(
        `Impossible de sélectionner un pattern pour capabilities=[${caps.join(', ')}]`
    );
}
