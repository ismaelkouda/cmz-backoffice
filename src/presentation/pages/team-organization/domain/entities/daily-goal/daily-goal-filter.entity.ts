import { DailyGoalFilterVo } from '@pages/team-organization/domain/value-objects/daily-goal/daily-goal-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class DailyGoalFilterEntity {
    constructor(public readonly period?: DatePeriod) {}

    static fromVo(vo: DailyGoalFilterVo): DailyGoalFilterEntity {
        return new DailyGoalFilterEntity(vo.period);
    }

    isRestrictedByPeriod(): boolean {
        return !!this.period;
    }
}
