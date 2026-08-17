import { ProfilesPermissionsUsersReassignEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-reassign.entity';
import { ProfilesPermissionsUsersReassignApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-reassign-api.dto';

export function profilesPermissionsUsersReassignMapper(
    vo: ProfilesPermissionsUsersReassignEntity
): ProfilesPermissionsUsersReassignApiDto {
    const params: ProfilesPermissionsUsersReassignApiDto =
        {} as ProfilesPermissionsUsersReassignApiDto;

    if (vo.uniqId) {
        params.uniq_id = vo.uniqId;
    }

    if (vo.users) {
        params.user_ids = vo.users;
    }

    return params;
}
