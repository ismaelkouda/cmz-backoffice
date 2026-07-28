/**
 * Regle metier partagee : quand un filtre ne fournit qu'une date de debut sans
 * date de fin, on considere la plage ouverte jusqu'a aujourd'hui.
 *
 * Extrait suite a une duplication identique constatee (meme corps de fonction,
 * copie-colle) dans administrative-infrastructure (infrastructure, infrastructure-type),
 * report-states (download, reject, evaluate, close, approve) et communication
 * (messaging, notifications) — 9 occurrences au total avant centralisation.
 * @param startDate
 * @param endDate
 */
export function resolveOpenEndedEndDate(
    startDate?: Date,
    endDate?: Date
): Date | undefined {
    return startDate && !endDate ? new Date() : endDate;
}
