import { TasksActionsTypeFilterEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-type-filter.entity';
import { TasksActionsTypeFilterApiDto } from '@presentation/pages/processing/infrastructure/api/dto/tasks/tasks-actions-type-filter-api.dto';

export function tasksActionsTypeFilterMapper(
    entity: TasksActionsTypeFilterEntity
): TasksActionsTypeFilterApiDto {
    const params: TasksActionsTypeFilterApiDto =
        {} as TasksActionsTypeFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}
