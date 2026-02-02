export class DatePeriod {
    public readonly start: Date;
    public readonly end: Date;

    private constructor(start: Date, end: Date) {
        this.start = start;
        this.end = end;
    }

    static create(startDate?: string, endDate?: string): DatePeriod {
        const now = new Date();

        const start = startDate ? new Date(startDate) : now;
        const end = endDate ? new Date(endDate) : now;

        if (start > end) {
            throw new Error('INVALID_DATE_RANGE');
        }

        return new DatePeriod(start, end);
    }
}
