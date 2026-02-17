import { ProfilesPermissionsFreeUsersAssignEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-free-users-assign.entity';
import { ProfilesPermissionsFreeUsersAssignApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-free-users-assign-api.dto';

export function profilesPermissionsFreeUsersAssignMapper(
    vo: ProfilesPermissionsFreeUsersAssignEntity
): ProfilesPermissionsFreeUsersAssignApiDto {
    const params: ProfilesPermissionsFreeUsersAssignApiDto =
        {} as ProfilesPermissionsFreeUsersAssignApiDto;

    if (vo.uniqId) {
        params.profile_user_id = vo.uniqId;
    }

    if (vo.users) {
        params.users = vo.users;
    }

    return params;
}
