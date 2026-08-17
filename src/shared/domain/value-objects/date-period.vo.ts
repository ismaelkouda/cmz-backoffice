import {
    InvalidDateRangeError,
    InvalidEndDateError,
    InvalidStartDateError,
} from '@shared/domain/errors/date-period/date-period.error';
export class DatePeriod {
    public readonly start?: Date;
    public readonly end?: Date;

    private constructor(start?: Date, end?: Date) {
        this.start = start;
        this.end = end;
    }

    static create(start?: string | null, end?: string | null): DatePeriod {
        const startDate = start ? new Date(start) : undefined;
        const endDate = end ? new Date(end) : undefined;

        if (startDate && Number.isNaN(startDate.getTime())) {
            throw new InvalidStartDateError();
        }

        if (endDate && isNaN(endDate.getTime())) {
            throw new InvalidEndDateError();
        }

        if (startDate && endDate && startDate > endDate) {
            throw new InvalidDateRangeError();
        }

        return new DatePeriod(startDate, endDate);
    }

    /**
     * Construit une periode uniquement si au moins une borne est fournie.
     * Centralise ici la decision "y a-t-il un filtre de date ?" : les VO
     * appelants n'ont pas a reimplementer cette regle (elle est identique
     * partout ou une periode est optionnelle).
     * @param start - Date de debut (optionnelle).
     * @param end - Date de fin (optionnelle).
     * @returns La periode construite, ou `null` si aucune des deux bornes n'est fournie.
     */
    static createOptional(
        start?: string | null,
        end?: string | null
    ): DatePeriod | null {
        if (!start && !end) {
            return null;
        }

        return DatePeriod.create(start, end);
    }
}
