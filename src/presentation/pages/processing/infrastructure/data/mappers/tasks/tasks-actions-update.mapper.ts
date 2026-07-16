import { TasksActionsUpdateValidateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-update.validate-contract';
import { TasksActionsUpdateApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-update-api.dto';

import { ConformityMapper } from './tasks-actions-conformity.mapper';
import { mapBaseTasksActionsDto } from './tasks-actions-store.mapper';

export function tasksActionsUpdateMapper(
    props: TasksActionsUpdateValidateContract,
    conformityMapper: ConformityMapper
): TasksActionsUpdateApiDto {
    return {
        uniq_id: props.uniqId,
        ...mapBaseTasksActionsDto(props, conformityMapper),
    };
}
