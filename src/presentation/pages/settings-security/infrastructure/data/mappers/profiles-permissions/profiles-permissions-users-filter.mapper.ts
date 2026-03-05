import { ProfilesPermissionsUsersFilterEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-filter.entity';
import { ProfilesPermissionsUsersFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-filter-api.dto';

export function profilesPermissionsUsersFilterMapper(
    vo: ProfilesPermissionsUsersFilterEntity
): ProfilesPermissionsUsersFilterApiDto {
    const params: ProfilesPermissionsUsersFilterApiDto =
        {} as ProfilesPermissionsUsersFilterApiDto;

    if (vo.uniqId) {
        params.uniq_id = vo.uniqId;
    }

    return params;
}
