import { UsersCreateContract } from '@pages/settings-security/domain/contracts/users/users-create.contract';
import { UsersCreateValidateContract } from '@pages/settings-security/domain/contracts/users/users-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateUsersCreate(
    contract: UsersCreateContract
): asserts contract is UsersCreateValidateContract {
    if (!contract.firstName) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.USERS.FORM.ERROR.CREATE.FIRST_NAME_REQUIRE'
        );
    }
    if (!contract.lastName) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.USERS.FORM.ERROR.CREATE.LAST_NAME_REQUIRE'
        );
    }
    if (!contract.email) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.USERS.FORM.ERROR.CREATE.EMAIL_REQUIRE'
        );
    }
    if (!contract.profile) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.USERS.FORM.ERROR.CREATE.PROFILE_REQUIRE'
        );
    }
}
