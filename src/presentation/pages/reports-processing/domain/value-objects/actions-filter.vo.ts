import { ActionsFilterPayloadEntity } from '../entities/actions/actions-filter-payload.entity';

export class ActionsFilter {
    private constructor(
        public readonly reportUniqId?: string,
        public readonly type?: string,
        public readonly dateFrom?: string,
        public readonly dateTo?: string
    ) {}

    static create(payload: ActionsFilterPayloadEntity): ActionsFilter {
        return new ActionsFilter(
            payload.report_uniq_id,
            payload.type,
            payload.date_from,
            payload.date_to
        );
    }

    toDto(): Record<string, string> {
        const dto: Record<string, string> = {};

        if (this.reportUniqId) dto['report_uniq_id'] = this.reportUniqId;
        if (this.type) dto['type'] = this.type;
        if (this.dateFrom) dto['date_from'] = this.dateFrom;
        if (this.dateTo) dto['date_to'] = this.dateTo;

        return dto;
    }
}
