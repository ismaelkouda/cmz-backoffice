import { ProfilesPermissionsCreateEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-create.entity';
import { ProfilesPermissionsCreateApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-create-api.dto';

export function profilesPermissionsCreateMapper(
    entity: ProfilesPermissionsCreateEntity
): ProfilesPermissionsCreateApiDto {
    const params = {} as ProfilesPermissionsCreateApiDto;

    if (entity.name) {
        params.name = entity.name;
    }

    if (entity.description) {
        params.description = entity.description;
    }

    if (entity.permissions) {
        params['permissions'] = entity.permissions;
    }

    return params;
}
