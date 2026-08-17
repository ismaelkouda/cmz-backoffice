import { TasksFilterVo } from '@pages/requests/domain/value-objects/tasks/tasks-filter.vo';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class TasksFilterEntity {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: ReportType,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: TasksFilterVo): TasksFilterEntity {
        return new TasksFilterEntity(
            vo.initiatorPhoneNumber,
            vo.uniqId,
            vo.reportType,
            vo.operators,
            vo.source,
            vo.period
        );
    }
}
