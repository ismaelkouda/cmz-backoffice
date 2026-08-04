/**
 * Formate une date au format attendu par l'API : `YYYY-MM-DD`.
 *
 * Utilise les composantes locales (et non `toISOString()`) afin d'éviter
 * tout décalage de jour lié au fuseau horaire.
 */
export function toApiDateOnly(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
