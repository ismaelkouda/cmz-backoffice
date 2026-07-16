import { UsersUpdateContract } from '@pages/settings-security/domain/contracts/users/users-update.contract';
import { UsersUpdateValidateContract } from '@pages/settings-security/domain/contracts/users/users-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateUsersUpdate(
    contract: UsersUpdateContract
): asserts contract is UsersUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.USERS.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.firstName) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.USERS.FORM.ERROR.UPDATE.FIRST_NAME_REQUIRE'
        );
    }
    if (!contract.lastName) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.USERS.FORM.ERROR.UPDATE.LAST_NAME_REQUIRE'
        );
    }
    if (!contract.email) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.USERS.FORM.ERROR.UPDATE.EMAIL_REQUIRE'
        );
    }
    if (!contract.profile) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.USERS.FORM.ERROR.UPDATE.PROFILE_REQUIRE'
        );
    }
}
