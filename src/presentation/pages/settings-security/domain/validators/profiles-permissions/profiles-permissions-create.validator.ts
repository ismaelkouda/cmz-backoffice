import { ProfilesPermissionsCreateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-create.contract';
import { ProfilesPermissionsCreateValidateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateProfilesPermissionsCreate(
    contract: ProfilesPermissionsCreateContract
): asserts contract is ProfilesPermissionsCreateValidateContract {
    if (!contract.name) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FORM.ERROR.CREATE.NAME_REQUIRE'
        );
    }
    if (!contract.description) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FORM.ERROR.CREATE.DESCRIPTION_REQUIRE'
        );
    }
    if (!contract.permissions) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FORM.ERROR.CREATE.PERMISSIONS_REQUIRE'
        );
    }
}
