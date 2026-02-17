import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { TasksFilterVo } from '@presentation/pages/processing/domain/value-objects/tasks/tasks-filter.vo';

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
