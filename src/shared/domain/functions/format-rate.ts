export function formatRate(
    value: number | null | undefined
): string | undefined {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return undefined;
    }
    return new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 1,
    }).format(value);
}
