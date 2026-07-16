import { ProfilesPermissionsUpdateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-update.contract';
import { ProfilesPermissionsUpdateValidateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-update.validate-contract';
import { validateProfilesPermissionsUpdate } from '@pages/settings-security/domain/validators/profiles-permissions/profiles-permissions-update.validator';

export function profilesPermissionsUpdateVo(
    contract: ProfilesPermissionsUpdateContract
): ProfilesPermissionsUpdateValidateContract {
    validateProfilesPermissionsUpdate(contract);
    return {
        uniqId: contract.uniqId,
        name: contract.name,
        description: contract.description,
        permissions: contract.permissions,
    };
}
