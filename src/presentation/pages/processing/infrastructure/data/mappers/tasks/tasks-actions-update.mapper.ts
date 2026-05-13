import { TasksActionsUpdateEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-update.entity';
import { TasksActionsUpdateApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-update-api.dto';

import { ConformityMapper } from './tasks-actions-conformity.mapper';
import { mapBaseTasksActionsDto } from './tasks-actions-store.mapper';

export function tasksActionsUpdateMapper(
    entity: TasksActionsUpdateEntity,
    conformityMapper: ConformityMapper
): TasksActionsUpdateApiDto {
    return {
        uniq_id: entity.uniqId,
        ...mapBaseTasksActionsDto(entity, conformityMapper),
    };
}
