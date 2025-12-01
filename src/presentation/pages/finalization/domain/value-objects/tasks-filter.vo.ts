import { TasksFilterPayloadEntity } from '../entities/tasks/tasks-filter-payload.entity';

export class TasksFilter {
    private constructor(
        private readonly initiatorPhoneNumber?: string,
        private readonly source?: string,
        private readonly createdFrom?: string,
        private readonly createdTo?: string,
        private readonly uniqId?: string,
        private readonly reportType?: string,
        private readonly operators?: string[]
    ) { }

    static create(data: TasksFilterPayloadEntity): TasksFilter {
        const operatorArray = this.normalizeOperator(data.operators);
        return new TasksFilter(
            data.initiator_phone_number,
            data.source,
            data.created_from,
            data.created_to,
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
        if (this.createdFrom) params['created_from'] = this.createdFrom;
        if (this.createdTo) params['created_to'] = this.createdTo;
        if (this.reportType) params['report_type'] = this.reportType;
        if (this.source) params['source'] = this.source;
        if (this.operators && this.operators.length > 0)
            params['operators'] = this.operators;

        return params;
    }
}
