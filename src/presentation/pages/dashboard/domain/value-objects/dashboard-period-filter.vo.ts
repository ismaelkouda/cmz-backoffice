export class DashboardPeriodFilter {
    private constructor(public readonly days: number) {}

    static create(days: number | null | undefined): DashboardPeriodFilter {
        const validDays = days ?? 30;

        if (validDays < 1) {
            throw new Error('DASHBOARD.FILTER.PERIOD.INVALID');
        }

        return new DashboardPeriodFilter(validDays);
    }

    toQueryParams(): { days: string } | Record<string, never> {
        if (this.days === 30) {
            return {};
        }
        return { days: this.days.toString() };
    }
}

