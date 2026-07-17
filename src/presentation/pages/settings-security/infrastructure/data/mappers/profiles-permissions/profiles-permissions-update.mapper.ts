import { ProfilesPermissionsUpdateValidateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-update.validate-contract';
import { ProfilesPermissionsUpdateApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-update-api.dto';

export function profilesPermissionsUpdateMapper(
    props: ProfilesPermissionsUpdateValidateContract
): ProfilesPermissionsUpdateApiDto {
    const params: ProfilesPermissionsUpdateApiDto =
        {} as ProfilesPermissionsUpdateApiDto;

    params['id'] = props.uniqId;

    if (props.name) {
        params['name'] = props.name;
    }
    if (props.description) {
        params['description'] = props.description;
    }
    if (props.permissions) {
        params['permissions'] = props.permissions;
    }

    return params;
}
