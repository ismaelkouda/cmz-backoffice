import { QueuesFilterPayloadEntity } from '../entities/queues/queues-filter-payload.entity';

export class QueuesFilter {
    private constructor(
        private readonly initiatorPhoneNumber?: string,
        private readonly source?: string,
        private readonly startDate?: string,
        private readonly endDate?: string,
        private readonly uniqId?: string,
        private readonly reportType?: string,
        private readonly operators?: string[]
    ) { }

    static create(data: QueuesFilterPayloadEntity): QueuesFilter {
        const operatorArray = this.normalizeOperator(data.operators);

        return new QueuesFilter(
            data.initiator_phone_number,
            data.source,
            data.start_date,
            data.end_date,
            data.uniq_id,
            data.report_type,
            operatorArray
        );
    }

    private static normalizeOperator(
        operators: string | string[] | undefined
    ): string[] {
        if (Array.isArray(operators)) {
            return operators;
        }
        return operators ? [operators] : [];
    }

    toDto(): Record<string, string | string[]> {
        const params: Record<string, string | string[]> = {};

        if (this.initiatorPhoneNumber)
            params['initiator_phone_number'] = this.initiatorPhoneNumber;
        if (this.uniqId) params['uniq_id'] = this.uniqId;
        if (this.startDate) params['start_date'] = this.startDate;
        if (this.endDate) params['end_date'] = this.endDate;
        if (this.reportType) params['report_type'] = this.reportType;
        if (this.source) params['source'] = this.source;
        if (this.operators && this.operators.length > 0)
            params['operators'] = this.operators;

        return params;
    }
}
