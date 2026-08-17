import { ProfilesPermissionsCreateValidateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-create.validate-contract';
import { ProfilesPermissionsCreateApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-create-api.dto';

export function profilesPermissionsCreateMapper(
    props: ProfilesPermissionsCreateValidateContract
): ProfilesPermissionsCreateApiDto {
    const params = {} as ProfilesPermissionsCreateApiDto;

    if (props.name) {
        params.name = props.name;
    }

    if (props.description) {
        params.description = props.description;
    }

    if (props.permissions) {
        params['permissions'] = props.permissions;
    }

    return params;
}
