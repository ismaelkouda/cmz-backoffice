import { NotificationsFilterPayloadEntity } from '../entities/notifications-filter-payload.entity';

export class NotificationsFilter {
    private constructor(
        private readonly initiatorPhoneNumber?: string,
        private readonly source?: string,
        private readonly startDate?: string,
        private readonly endDate?: string,
        private readonly uniqId?: string,
        private readonly type?: string,
        private readonly operators?: string[]
    ) { }

    static create(
        data: NotificationsFilterPayloadEntity = {} as NotificationsFilterPayloadEntity
    ): NotificationsFilter {
        const operatorArray = this.normalizeOperator(data.operators);

        return new NotificationsFilter(
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
        operator: string | string[] | undefined
    ): string[] {
        if (Array.isArray(operator)) {
            return operator;
        }
        return operator ? [operator] : [];
    }

    toDto(): Record<string, string | string[]> {
        const params: Record<string, string | string[]> = {};

        if (this.initiatorPhoneNumber)
            params['initiator_phone_number'] = this.initiatorPhoneNumber;
        if (this.uniqId) params['uniq_id'] = this.uniqId;
        if (this.startDate) params['start_date'] = this.startDate;
        if (this.endDate) params['end_date'] = this.endDate;
        if (this.type) params['report_type'] = this.type;
        if (this.source) params['source'] = this.source;
        if (this.operators && this.operators.length > 0)
            params['operators'] = this.operators;

        return params;
    }
}
