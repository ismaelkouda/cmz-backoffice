import { DateRangeInvalidError } from '@shared/domain/errors/validation/date-range-invalid.error';

/**
 * Assertion partagee : leve DateRangeInvalidError si les deux bornes sont
 * fournies et que startDate est posterieure a endDate.
 *
 * Extrait suite a une duplication identique constatee (meme corps de fonction,
 * copie-colle) dans administrative-infrastructure (infrastructure, infrastructure-type),
 * report-states (download, reject, evaluate, close, approve) et communication
 * (messaging, notifications) — 9 occurrences au total avant centralisation.
 */
export function assertValidDateRange(startDate?: Date, endDate?: Date): void {
    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
        throw new DateRangeInvalidError();
    }
}
