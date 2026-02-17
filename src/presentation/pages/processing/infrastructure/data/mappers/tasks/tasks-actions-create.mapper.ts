import { TasksActionsCreateEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-create.entity';
import { TasksActionsCreateApiDto } from '@presentation/pages/processing/infrastructure/api/dto/tasks/tasks-actions-create-api.dto';

export function tasksActionsCreateMapper(
    entity: TasksActionsCreateEntity
): TasksActionsCreateApiDto {
    return {
        date: entity.date,
        type: entity.type,
        description: entity.description,
        should_notify_user: Boolean(entity.shouldNotifyUser),
    };
}
