import { ProfilesPermissionsUsersAssignEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-assign.entity';
import { ProfilesPermissionsUsersAssignApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-assign-api.dto';

export function profilesPermissionsUsersAssignMapper(
    entity: ProfilesPermissionsUsersAssignEntity
): ProfilesPermissionsUsersAssignApiDto {
    const params: ProfilesPermissionsUsersAssignApiDto =
        {} as ProfilesPermissionsUsersAssignApiDto;

    if (entity.uniqId) {
        params.uniq_id = entity.uniqId;
    }

    if (entity.users) {
        params.user_ids = entity.users;
    }

    return params;
}
