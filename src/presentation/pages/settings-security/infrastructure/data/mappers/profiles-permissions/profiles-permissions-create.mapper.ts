import { ProfilesPermissionsCreateEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-create.entity';
import { ProfilesPermissionsCreateApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-create-api.dto';

export function profilesPermissionsCreateMapper(
    vo: ProfilesPermissionsCreateEntity
): ProfilesPermissionsCreateApiDto {
    const params: ProfilesPermissionsCreateApiDto =
        {} as ProfilesPermissionsCreateApiDto;

    if (vo.name) {
        params['name'] = vo.name;
    }
    if (vo.description) {
        params['description'] = vo.description;
    }
    if (vo.permissions && vo.permissions.length > 0) {
        params['permissions'] = vo.permissions;
    }

    return params;
}
