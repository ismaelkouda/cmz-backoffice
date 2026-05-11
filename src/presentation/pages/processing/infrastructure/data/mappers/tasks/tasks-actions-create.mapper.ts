import { TasksActionsCreateEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-create.entity';
import { TasksActionsCreateApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-create-api.dto';

export function tasksActionsCreateMapper(
    entity: TasksActionsCreateEntity
): TasksActionsCreateApiDto {
    return {
        report_uniq_id: entity.reportUniqId,
        date: entity.date ? entity.date : new Date(),
        operator: entity.operator.toLowerCase(),
        type_code: entity.type,
        description: entity.description,
        should_notify_user: Boolean(entity.shouldNotifyUser),
        status: Boolean(entity.isConform),
    };
}
