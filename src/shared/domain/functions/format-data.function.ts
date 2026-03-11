export function formatDate(value: string): string {
    if (!value) {
        return '-';
    }
    try {
        const normalized = value.includes('T')
            ? value
            : value.replace(' ', 'T');
        const withTimezone = normalized.endsWith('Z')
            ? normalized
            : `${normalized}Z`;
        const date = new Date(withTimezone);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
    } catch {
        return value;
    }
}
