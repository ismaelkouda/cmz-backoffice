import moment, { Moment } from 'moment';

export interface DateRangeResult {
    startDate?: Moment;
    endDate?: Moment;
    isValidRange: boolean;
}

export function parseAndValidateDateRange(
    start?: string,
    end?: string
): DateRangeResult {
    const startDate = start
        ? moment(start, moment.ISO_8601, true)
        : undefined;

    const endDate = end
        ? moment(end, moment.ISO_8601, true)
        : undefined;

    if (!startDate?.isValid() || !endDate?.isValid()) {
        return {
            startDate,
            endDate,
            isValidRange: true,
        };
    }

    return {
        startDate,
        endDate,
        isValidRange: !startDate.isAfter(endDate),
    };
}
