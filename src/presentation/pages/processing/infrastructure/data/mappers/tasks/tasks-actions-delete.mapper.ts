import { TasksActionsDeleteEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-delete.entity';
import { TasksActionsDeleteApiDto } from '@presentation/pages/processing/infrastructure/api/dto/tasks/tasks-actions-delete-api.dto';

export function tasksActionsDeleteMapper(
    entity: TasksActionsDeleteEntity
): TasksActionsDeleteApiDto {
    return { uniq_id: entity.uniqId };
}
