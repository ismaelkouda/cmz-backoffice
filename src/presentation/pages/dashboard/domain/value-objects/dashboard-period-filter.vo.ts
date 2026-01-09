import { Filter } from "@shared/application/base/object-base-facade";
import { InvalidFilterError } from "@shared/domain/errors/filter.error";

export class DashboardPeriodFilter implements Filter {
    private constructor(public readonly period: number) { }

    static create(period: number): DashboardPeriodFilter {
        const validPeriod = period ?? 30;

        if (validPeriod < 1) {
            throw new InvalidFilterError('DASHBOARD.FILTER.PERIOD.INVALID');
        }

        return new DashboardPeriodFilter(validPeriod);
    }

    toDto(): Record<string, string> {
        return { period: this.period.toString() };
    }
}
