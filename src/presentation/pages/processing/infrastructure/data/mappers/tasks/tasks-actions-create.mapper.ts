import { TasksActionsCreateEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-create.entity';
import { TasksActionsCreateApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-create-api.dto';

import { ConformityMapper } from './tasks-actions-conformity.mapper';
import { mapBaseTasksActionsDto } from './tasks-actions-store.mapper';

export function tasksActionsCreateMapper(
    entity: TasksActionsCreateEntity,
    conformityMapper: ConformityMapper
): TasksActionsCreateApiDto {
    return mapBaseTasksActionsDto(entity, conformityMapper);
}
