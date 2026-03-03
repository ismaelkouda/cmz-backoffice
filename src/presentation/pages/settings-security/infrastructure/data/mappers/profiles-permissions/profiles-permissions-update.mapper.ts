import { ProfilesPermissionsUpdateEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-update.entity';
import { ProfilesPermissionsUpdateApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-update-api.dto';

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
    if (entity.permissions) {
        params['permissions'] = entity.permissions.map(Number);
    }

    return params;
}
