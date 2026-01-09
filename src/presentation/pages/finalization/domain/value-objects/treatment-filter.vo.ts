import { TreatmentFilterPayloadEntity } from '../entities/treatment/treatment-filter-payload.entity';

export class TreatmentFilter {
    private constructor(
        private readonly startDate: string,
        private readonly endDate: string,
        private readonly reportType?: string,
        private readonly state?: string,
        private readonly operator?: string
    ) { }

    static create(data: TreatmentFilterPayloadEntity): TreatmentFilter {
        return new TreatmentFilter(
            data.start_date,
            data.end_date,
            data.report_type,
            data.state,
            data.operator
        );
    }

    toDto(): Record<string, string> {
        const params: Record<string, string> = {};

        if (this.startDate) {
            params['start_date'] = this.startDate;
        }

        if (this.endDate) {
            params['end_date'] = this.endDate;
        }

        if (this.reportType) {
            params['report_type'] = this.reportType;
        }

        if (this.state) {
            params['state'] = this.state;
        }

        if (this.operator) {
            params['operator'] = this.operator;
        }

        return params;
    }
}
