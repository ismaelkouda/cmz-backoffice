import { DailyGoalFilterEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal-filter.entity';
import { DailyGoalFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/daily-goal/daily-goal-filter-api.dto';

export function DailyGoalFilterMapper(
    entity: DailyGoalFilterEntity
): DailyGoalFilterApiDto {
    const params: DailyGoalFilterApiDto = {} as DailyGoalFilterApiDto;

    if (entity.period?.start) {
        params.start_date = entity.period.start;
    }
    if (entity.period?.end) {
        params.end_date = entity.period.end;
    }

    return params;
}
