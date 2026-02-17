import { TasksActionsFilterEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-filter.entity';
import { TasksActionsFilterApiDto } from '@presentation/pages/processing/infrastructure/api/dto/tasks/tasks-actions-filter-api.dto';

export function TasksActionsFilterMapper(
    entity: TasksActionsFilterEntity
): TasksActionsFilterApiDto {
    return { uniq_id: entity.uniqId };
}
