import { DatePeriod } from '@shared/core/domain/value-object/date-period.vo';

import { QueuesFilterDto } from '../../application/dto/queues-filter.dto';

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
        const initiatorPhoneNumber =
            dto?.initiatorPhoneNumber?.trim() || undefined;
        const uniqId = dto?.uniqId?.trim() || undefined;
        const reportType = dto?.reportType?.trim() || undefined;
        const operators = dto?.operators;
        const source = dto?.source?.trim() || undefined;

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
