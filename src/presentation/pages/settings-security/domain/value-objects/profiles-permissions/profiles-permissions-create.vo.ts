import { ProfilesPermissionsCreateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-create.contract';
import { ProfilesPermissionsCreateValidateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-create.validate-contract';
import { validateProfilesPermissionsCreate } from '@pages/settings-security/domain/validators/profiles-permissions/profiles-permissions-create.validator';

export function profilesPermissionsCreateVo(
    contract: ProfilesPermissionsCreateContract
): ProfilesPermissionsCreateValidateContract {
    validateProfilesPermissionsCreate(contract);
    return {
        name: contract.name,
        description: contract.description,
        permissions: contract.permissions,
    };
}
