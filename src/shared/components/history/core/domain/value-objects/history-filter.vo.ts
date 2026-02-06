import { HistoryFilterDto } from '@shared/components/history/core/application/dtos/history-filter.dto';
import { DatePeriod } from '@shared/core/domain/value-object/date-period.vo';

export class HistoryFilterVo {
    public readonly search?: string;
    public readonly period?: DatePeriod;

    constructor(props: { search?: string; period?: DatePeriod }) {
        this.search = props.search;
        this.period = props.period;
    }

    static fromDto(dto: HistoryFilterDto | null): HistoryFilterVo {
        const search = dto?.search?.trim() || undefined;

        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new HistoryFilterVo({ search, period });
    }
}
