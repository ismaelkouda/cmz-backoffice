import { TasksActionsUpdateEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-update.entity';
import { TasksActionsUpdateApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-update-api.dto';

export function tasksActionsUpdateMapper(
    entity: TasksActionsUpdateEntity
): TasksActionsUpdateApiDto {
    return {
        uniq_id: entity.uniqId,
        report_uniq_id: entity.reportUniqId,
        date: entity.date ? entity.date : new Date(),
        type: entity.type,
        description: entity.description,
        should_notify_user: Boolean(entity.shouldNotifyUser),
    };
}
