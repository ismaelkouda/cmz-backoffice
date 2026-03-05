import { ProfilesPermissionsUsersRemoveEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-remove.entity';
import { ProfilesPermissionsUsersRemoveApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-remove-api.dto';

export function profilesPermissionsUsersRemoveMapper(
    vo: ProfilesPermissionsUsersRemoveEntity
): ProfilesPermissionsUsersRemoveApiDto {
    const params: ProfilesPermissionsUsersRemoveApiDto =
        {} as ProfilesPermissionsUsersRemoveApiDto;

    if (vo.uniqId) {
        params.uniq_id = vo.uniqId;
    }

    if (vo.users) {
        params.users = vo.users;
    }

    return params;
}
