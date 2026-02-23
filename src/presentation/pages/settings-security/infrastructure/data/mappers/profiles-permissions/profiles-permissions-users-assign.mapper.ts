import { ProfilesPermissionsUsersAssignEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-assign.entity';
import { ProfilesPermissionsUsersAssignApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-assign-api.dto';

export function profilesPermissionsUsersAssignMapper(
    vo: ProfilesPermissionsUsersAssignEntity
): ProfilesPermissionsUsersAssignApiDto {
    const params: ProfilesPermissionsUsersAssignApiDto =
        {} as ProfilesPermissionsUsersAssignApiDto;

    if (vo.uniqId) {
        params.profile_user_id = vo.uniqId;
    }

    if (vo.users) {
        params.users = vo.users;
    }

    return params;
}
