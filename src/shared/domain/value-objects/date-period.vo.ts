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
}
