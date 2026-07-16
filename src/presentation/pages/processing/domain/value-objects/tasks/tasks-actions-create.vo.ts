import { TasksActionsCreateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-create.contract';
import { TasksActionsCreateValidateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-create.validate-contract';
import { validateTasksActionsCreate } from '@pages/processing/domain/validators/tasks/tasks-actions-create.validator';

export function tasksActionsCreateVo(
    contract: TasksActionsCreateContract
): TasksActionsCreateValidateContract {
    validateTasksActionsCreate(contract);
    return {
        reportUniqId: contract.reportUniqId,
        date: contract.date,
        type: contract.type,
        operator: contract.operator,
        description: contract.description,
        shouldNotifyUser: contract.shouldNotifyUser ?? false,
        isConform: contract.isConform,
    };
}
