import { ProfilesPermissionsUpdateEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-update.entity';
import { ProfilesPermissionsUpdateApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-update-api.dto';

export function profilesPermissionsUpdateMapper(
    entity: ProfilesPermissionsUpdateEntity
): ProfilesPermissionsUpdateApiDto {
    const params: ProfilesPermissionsUpdateApiDto =
        {} as ProfilesPermissionsUpdateApiDto;

    params['id'] = entity.uniqId;

    if (entity.name) {
        params['name'] = entity.name;
    }
    if (entity.description) {
        params['description'] = entity.description;
    }
    if (entity.permissions && entity.permissions.length > 0) {
        params['permissions'] = entity.permissions;
    }

    return params;
}
