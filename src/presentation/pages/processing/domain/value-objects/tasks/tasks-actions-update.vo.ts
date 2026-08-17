import { TasksActionsUpdateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-update.contract';
import { TasksActionsUpdateValidateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-update.validate-contract';
import { validateTasksActionsUpdate } from '@pages/processing/domain/validators/tasks/tasks-actions-update.validator';

export function tasksActionsUpdateVo(
    contract: TasksActionsUpdateContract
): TasksActionsUpdateValidateContract {
    validateTasksActionsUpdate(contract);
    return {
        uniqId: contract.uniqId,
        reportUniqId: contract.reportUniqId,
        date: contract.date,
        type: contract.type,
        operator: contract.operator,
        description: contract.description,
        shouldNotifyUser: contract.shouldNotifyUser ?? false,
        isConform: contract.isConform,
    };
}
