import { normalizePhoneNumber } from '@shared/domain/services/normalize-phone-number';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { TasksFilterDto } from '@presentation/pages/processing/application/dto/tasks/tasks-filter.dto';

export class TasksFilterVo {
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
        this.source = props.source;
        this.period = props.period;
    }

    static fromDto(dto: TasksFilterDto | null): TasksFilterVo {
        const initiatorPhoneNumber = normalizePhoneNumber(
            dto?.initiatorPhoneNumber?.trim()
        );
        const uniqId = dto?.uniqId;
        const reportType = dto?.reportType;
        const operators = dto?.operators;
        const source = dto?.source;

        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new TasksFilterVo({
            initiatorPhoneNumber,
            uniqId,
            reportType,
            operators,
            source,
            period,
        });
    }
}
