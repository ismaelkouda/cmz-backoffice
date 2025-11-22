export class DashboardPeriodFilter {
    private constructor(public readonly period: number) {}

    static create(period: number | null | undefined): DashboardPeriodFilter {
        const validPeriod = period ?? 30;

        if (validPeriod < 1) {
            throw new Error('DASHBOARD.FILTER.PERIOD.INVALID');
        }

        return new DashboardPeriodFilter(validPeriod);
    }

    toQueryParams(): { period: string } | Record<string, never> {
        if (this.period === 30) {
            return {};
        }
        return { period: this.period.toString() };
    }
}
