/** Helpers de nommage SEOS DSL → TypeScript/Angular. */

export function toKebab(value) {
    return String(value)
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .replace(/-+/g, '-')
        .toLowerCase();
}

export function toPascal(value) {
    return toKebab(value)
        .split('-')
        .filter(Boolean)
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join('');
}

export function toUpperSnake(value) {
    return toKebab(value).replace(/-/g, '_').toUpperCase();
}

export function toCamel(value) {
    const p = toPascal(value);
    return p ? p[0].toLowerCase() + p.slice(1) : p;
}

export function fieldTsType(field) {
    switch (field.type) {
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'date':
            return 'string';
        case 'enum':
            return (field.values || []).map((v) => `'${v}'`).join(' | ') || 'string';
        case 'text':
        case 'string':
        default:
            return 'string';
    }
}

export function fieldConstKey(name) {
    return toUpperSnake(name);
}
