import { TasksActionsCreateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-create.contract';
import { TasksActionsCreateValidateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateTasksActionsCreate(
    contract: TasksActionsCreateContract
): asserts contract is TasksActionsCreateValidateContract {
    if (!contract.reportUniqId) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.CREATE.REPORT_UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.date) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.CREATE.DATE_REQUIRE'
        );
    }
    if (!contract.type) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.CREATE.TYPE_REQUIRE'
        );
    }
    if (!contract.operator) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.CREATE.OPERATOR_REQUIRE'
        );
    }
    if (!contract.description) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.CREATE.DESCRIPTION_REQUIRE'
        );
    }
    if (contract.isConform === null || contract.isConform === undefined) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.CREATE.IS_CONFORM_REQUIRE'
        );
    }
}
