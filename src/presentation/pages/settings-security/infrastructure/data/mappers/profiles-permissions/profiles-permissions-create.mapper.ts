import { ProfilesPermissionsCreateEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-create.entity';
import { ProfilesPermissionsCreateApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-create-api.dto';

export function profilesPermissionsCreateMapper(
    entity: ProfilesPermissionsCreateEntity
): ProfilesPermissionsCreateApiDto {
    const params: ProfilesPermissionsCreateApiDto =
        {} as ProfilesPermissionsCreateApiDto;

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
