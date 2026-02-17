import { ProfilesPermissionsFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-filter.entity';
import { ProfilesPermissionsFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-filter-api.dto';

export function profilesPermissionsFilterMapper(
    vo: ProfilesPermissionsFilterEntity
): ProfilesPermissionsFilterApiDto {
    const params: ProfilesPermissionsFilterApiDto =
        {} as ProfilesPermissionsFilterApiDto;

    if (vo.search) {
        params.search = vo.search;
    }
    if (vo.user) {
        params.user = vo.user;
    }
    if (vo.isActive !== undefined) {
        params.is_active = !!vo.isActive;
    }

    return params;
}
