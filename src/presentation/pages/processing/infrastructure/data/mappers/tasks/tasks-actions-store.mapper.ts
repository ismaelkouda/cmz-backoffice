import { TasksActionsCreateEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-create.entity';
import { TasksActionsUpdateEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-update.entity';
import { TasksActionsStoreApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-store-api.dto';
import { ConformityMapper } from '@pages/processing/infrastructure/data/mappers/tasks/tasks-actions-conformity.mapper';

type TasksActionFormEntity =
    | TasksActionsCreateEntity
    | TasksActionsUpdateEntity;

export function mapBaseTasksActionsDto(
    entity: TasksActionFormEntity,
    conformityMapper: ConformityMapper
): TasksActionsStoreApiDto {
    return {
        report_uniq_id: entity.reportUniqId,
        date: entity.date ?? new Date(),
        operator: entity.operator.toLowerCase(),
        type_code: entity.type,
        description: entity.description,
        should_notify_user: Boolean(entity.shouldNotifyUser),
        result: conformityMapper.mapToDto(entity.isConform),
    };
}
