import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { QueuesFilterDto } from '@presentation/pages/processing/application/dto/queues/queues-filter.dto';

export class QueuesFilterVo {
    public readonly initiatorPhoneNumber?: string;
    public readonly uniqId?: string;
    public readonly reportType?: string;
    public readonly operators?: string[];
    public readonly source?: string;
    public readonly period?: DatePeriod;

    private constructor(props: {
        initiatorPhoneNumber?: string;
        uniqId?: string;
        reportType?: string;
        operators?: string[];
        source?: string;
        period?: DatePeriod;
    }) {
        this.initiatorPhoneNumber = props.initiatorPhoneNumber;
        this.uniqId = props.uniqId;
        this.reportType = props.reportType;
        this.operators = props.operators;
        this.operators = props.operators;
        this.source = props.source;
        this.period = props.period;
    }

    static fromDto(dto: QueuesFilterDto | null): QueuesFilterVo {
        const initiatorPhoneNumber = dto?.initiatorPhoneNumber?.trim();
        const uniqId = dto?.uniqId?.trim();
        const reportType = dto?.reportType?.trim();
        const operators = dto?.operators;
        const source = dto?.source?.trim();

        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new QueuesFilterVo({
            initiatorPhoneNumber,
            uniqId,
            reportType,
            operators,
            source,
            period,
        });
    }
}
