import { NewspapersFilterPayloadEntity } from '../entities/management/newspapers/newspapers-filter-payload.entity';

export class NewspapersFilter {
    private constructor(
        private readonly report_uniq_id: string,
        private readonly source?: string,
        private readonly createdFrom?: string,
        private readonly createdTo?: string,
        private readonly reportType?: string,
        private readonly operator?: string[]
    ) {}

    static create(data: NewspapersFilterPayloadEntity): NewspapersFilter {
        const operatorArray = this.normalizeOperator(data.operator);

        return new NewspapersFilter(
            data.reportUniqId,
            data.source,
            data.created_from,
            data.created_to,
            data.report_type,
            operatorArray
        );
    }

    private static normalizeOperator(
        operator: string | string[] | undefined
    ): string[] {
        if (Array.isArray(operator)) {
            return operator;
        }
        return operator ? [operator] : [];
    }

    toDto(): any {
        const params: any = {};

        if (this.report_uniq_id)
            params['report_uniq_id'] = this.report_uniq_id || '';
        if (this.createdFrom) params['created_from'] = this.createdFrom;
        if (this.createdTo) params['created_to'] = this.createdTo;
        if (this.reportType) params['report_type'] = this.reportType;
        if (this.source) params['source'] = this.source;
        if (this.operator && this.operator.length > 0)
            params['operator'] = this.operator;

        return params;
    }
}
