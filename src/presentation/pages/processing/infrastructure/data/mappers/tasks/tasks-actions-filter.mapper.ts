import { TasksActionsFilterEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-filter.entity';
import { TasksActionsFilterApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-filter-api.dto';

export function TasksActionsFilterMapper(
    entity: TasksActionsFilterEntity
): TasksActionsFilterApiDto {
    return { uniq_id: entity.uniqId };
}
