import { TasksActionsUpdateEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-update.entity';
import { TasksActionsUpdateApiDto } from '@presentation/pages/processing/infrastructure/api/dto/tasks/tasks-actions-update-api.dto';

export function tasksActionsUpdateMapper(
    entity: TasksActionsUpdateEntity
): TasksActionsUpdateApiDto {
    return {
        uniq_id: entity.uniqId,
        date: entity.date,
        type: entity.type,
        description: entity.description,
        should_notify_user: Boolean(entity.shouldNotifyUser),
    };
}
