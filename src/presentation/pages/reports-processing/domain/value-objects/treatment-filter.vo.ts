import { TreatmentFilterPayloadEntity } from '../entities/treatment/treatment-filter-payload.entity';

export class TreatmentFilter {
    private constructor(
        private readonly createdFrom: string,
        private readonly createdTo: string,
        private readonly reportType?: string,
        private readonly state?: string,
        private readonly operator?: string
    ) {}

    static create(data: TreatmentFilterPayloadEntity): TreatmentFilter {
        return new TreatmentFilter(
            data.created_from,
            data.created_to,
            data.report_type,
            data.state,
            data.operator
        );
    }

    toDto(): Record<string, string> {
        const params: Record<string, string> = {};

        if (this.createdFrom) {
            params['created_from'] = this.createdFrom;
        }

        if (this.createdTo) {
            params['created_to'] = this.createdTo;
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
