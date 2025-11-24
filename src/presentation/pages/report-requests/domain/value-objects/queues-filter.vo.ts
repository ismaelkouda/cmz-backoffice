import { QueuesFilterPayloadEntity } from '../entities/queues/queues-filter-payload.entity';

export class QueuesFilter {
    private constructor(
        private readonly source?: string,
        private readonly createdFrom?: string,
        private readonly createdTo?: string,
        private readonly uniqId?: string,
        private readonly reportType?: string,
        private readonly operator?: string
    ) {}

    static create(data: QueuesFilterPayloadEntity): QueuesFilter {
        return new QueuesFilter(
            data.source,
            data.created_from,
            data.created_to,
            data.uniq_id,
            data.report_type,
            data.operator
        );
    }

    toDto(): Record<string, string> {
        const params: Record<string, string> = {};

        if (this.uniqId) {
            params['uniq_id'] = this.uniqId;
        }
        if (this.createdFrom) {
            params['created_from'] = this.createdFrom;
        }

        if (this.createdTo) {
            params['created_to'] = this.createdTo;
        }

        if (this.reportType) {
            params['report_type'] = this.reportType;
        }

        if (this.source) {
            params['source'] = this.source;
        }

        if (this.operator) {
            params['operator'] = this.operator;
        }

        return params;
    }
}
