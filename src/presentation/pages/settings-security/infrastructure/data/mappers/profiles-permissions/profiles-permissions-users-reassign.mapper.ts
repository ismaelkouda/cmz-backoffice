import { ProfilesPermissionsUsersReassignEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-reassign.entity';
import { ProfilesPermissionsUsersReassignApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-reassign-api.dto';

export function profilesPermissionsUsersReassignMapper(
    vo: ProfilesPermissionsUsersReassignEntity
): ProfilesPermissionsUsersReassignApiDto {
    const params: ProfilesPermissionsUsersReassignApiDto =
        {} as ProfilesPermissionsUsersReassignApiDto;

    if (vo.uniqId) {
        params.profile_user_id = vo.uniqId;
    }

    if (vo.users) {
        params.users = vo.users;
    }

    return params;
}
