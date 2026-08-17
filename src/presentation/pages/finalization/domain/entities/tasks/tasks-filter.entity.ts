import { TasksFilterVo } from '@pages/finalization/domain/value-objects/tasks/tasks-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class TasksFilterEntity {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: string,
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
