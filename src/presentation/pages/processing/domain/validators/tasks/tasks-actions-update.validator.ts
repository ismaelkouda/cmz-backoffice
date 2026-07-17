import { TasksActionsUpdateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-update.contract';
import { TasksActionsUpdateValidateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateTasksActionsUpdate(
    contract: TasksActionsUpdateContract
): asserts contract is TasksActionsUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.reportUniqId) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.UPDATE.REPORT_UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.date) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.UPDATE.DATE_REQUIRE'
        );
    }
    if (!contract.type) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.UPDATE.TYPE_REQUIRE'
        );
    }
    if (!contract.operator) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.UPDATE.OPERATOR_REQUIRE'
        );
    }
    if (!contract.description) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.UPDATE.DESCRIPTION_REQUIRE'
        );
    }
    if (contract.isConform === null || contract.isConform === undefined) {
        throw new GenericRequiredError(
            'PROCESSING.TASKS.ACTIONS.FORM.ERROR.UPDATE.IS_CONFORM_REQUIRE'
        );
    }
}
