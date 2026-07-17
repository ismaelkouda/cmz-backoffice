import { ProfilesPermissionsUpdateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-update.contract';
import { ProfilesPermissionsUpdateValidateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateProfilesPermissionsUpdate(
    contract: ProfilesPermissionsUpdateContract
): asserts contract is ProfilesPermissionsUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FORM.ERROR.UPDATE.NAME_REQUIRE'
        );
    }
    if (!contract.description) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FORM.ERROR.UPDATE.DESCRIPTION_REQUIRE'
        );
    }
    if (!contract.permissions) {
        throw new GenericRequiredError(
            'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FORM.ERROR.UPDATE.PERMISSIONS_REQUIRE'
        );
    }
}
