import { fieldTsType, toPascal, toUpperSnake } from './naming.js';
import { selectPattern } from './parse.js';

/**
 * Transforme un document DSL normalisé en config consommable par les générateurs.
 */
export function toGeneratorConfig(feature) {
    const pattern = selectPattern(feature);
    const entity = feature.feature.slug;
    const module = feature.feature.module;
    const Cap = toPascal(entity);
    const ModuleCap = toPascal(module);

    const fields = feature.fields.map((f) => ({
        ...f,
        tsType: fieldTsType(f),
        constKey: toUpperSnake(f.name),
    }));

    const filters = feature.filters.map((f) => ({
        ...f,
        tsType: fieldTsType({ type: f.type || 'string' }),
        constKey: toUpperSnake(f.name),
    }));

    if (feature.search.fullText && !filters.some((f) => f.name === 'search')) {
        filters.unshift({
            name: 'search',
            type: 'string',
            tsType: 'string',
            constKey: 'SEARCH',
        });
    }

    // Dates de filtre standard (pattern crud-entity)
    if (pattern === 'crud-entity') {
        for (const d of ['startDate', 'endDate']) {
            if (!filters.some((f) => f.name === d)) {
                filters.push({
                    name: d,
                    type: 'date',
                    tsType: 'Date',
                    constKey: toUpperSnake(d),
                });
            }
        }
    }

    const caps = new Set(feature.capabilities);

    return {
        pattern,
        root: null, // fixé par le CLI
        entity,
        entityCap: Cap,
        entityUpper: toUpperSnake(entity),
        module,
        moduleCap: ModuleCap,
        moduleUpper: toUpperSnake(module),
        description: feature.feature.description,
        actors: feature.actors,
        fields,
        filters,
        apiBase: feature.api.base,
        capabilities: {
            list: caps.has('list'),
            details: caps.has('details'),
            create: caps.has('create'),
            edit: caps.has('edit'),
            delete: caps.has('delete'),
            select: caps.has('select') || caps.has('list'),
            action: caps.has('action'),
        },
        pagination: feature.pagination,
        sorting: feature.sorting,
        extensions: {
            attachmentsUpload: feature.attachments.upload,
            map: feature.location.map,
            uiFramework: feature.ui.framework,
            architectureStyle: feature.architecture.style,
        },
        sourceDsl: feature.source,
    };
}
