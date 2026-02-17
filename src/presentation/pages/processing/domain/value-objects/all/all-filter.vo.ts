import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { AllFilterDto } from '@presentation/pages/processing/application/dto/all/all-filter.dto';

export class AllFilterVo {
    public readonly initiatorPhoneNumber?: string;
    public readonly uniqId?: string;
    public readonly reportType?: string;
    public readonly operators?: string[];
    public readonly state?: string;
    public readonly source?: string;
    public readonly period?: DatePeriod;

    private constructor(props: {
        initiatorPhoneNumber?: string;
        uniqId?: string;
        reportType?: string;
        operators?: string[];
        state?: string;
        source?: string;
        period?: DatePeriod;
    }) {
        this.initiatorPhoneNumber = props.initiatorPhoneNumber;
        this.uniqId = props.uniqId;
        this.reportType = props.reportType;
        this.operators = props.operators;
        this.state = props.state;
        this.source = props.source;
        this.period = props.period;
    }

    static fromDto(dto: AllFilterDto | null): AllFilterVo {
        const initiatorPhoneNumber = dto?.initiatorPhoneNumber?.trim();
        const uniqId = dto?.uniqId;
        const reportType = dto?.reportType;
        const operators = dto?.operators;
        const state = dto?.state;
        const source = dto?.source;

        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new AllFilterVo({
            initiatorPhoneNumber,
            uniqId,
            reportType,
            operators,
            state,
            source,
            period,
        });
    }
}
