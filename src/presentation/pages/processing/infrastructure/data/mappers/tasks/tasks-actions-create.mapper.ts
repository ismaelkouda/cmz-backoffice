import { TasksActionsCreateValidateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-create.validate-contract';
import { TasksActionsCreateApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-create-api.dto';

import { ConformityMapper } from './tasks-actions-conformity.mapper';
import { mapBaseTasksActionsDto } from './tasks-actions-store.mapper';

export function tasksActionsCreateMapper(
    props: TasksActionsCreateValidateContract,
    conformityMapper: ConformityMapper
): TasksActionsCreateApiDto {
    return mapBaseTasksActionsDto(props, conformityMapper);
}
