import { HistoryFilterDto } from '@shared/components/history/application/dto/history-filter.dto';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class HistoryFilterVo {
    public readonly typeModel?: string;
    public readonly module?: string;
    public readonly search?: string;
    public readonly period?: DatePeriod;

    constructor(props: {
        search?: string;
        period?: DatePeriod;
        typeModel?: string;
        module?: string;
    }) {
        this.typeModel = props.typeModel;
        this.module = props.module;
        this.search = props.search;
        this.period = props.period;
    }

    static fromDto(dto: HistoryFilterDto | null): HistoryFilterVo {
        const search = dto?.search?.trim() || undefined;
        const typeModel = dto?.typeModel?.trim();
        const module = dto?.module?.trim();

        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new HistoryFilterVo({ search, period, typeModel, module });
    }
}
