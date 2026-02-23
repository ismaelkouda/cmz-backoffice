import { ProfilesPermissionsFindOneFilterEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one-filter.entity';
import { ProfilesPermissionsFindOneFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-find-one-filter-api.dto';

export function profilesPermissionsFindOneFilterMapper(
    entity?: ProfilesPermissionsFindOneFilterEntity
): ProfilesPermissionsFindOneFilterApiDto | undefined {
    const params: ProfilesPermissionsFindOneFilterApiDto =
        {} as ProfilesPermissionsFindOneFilterApiDto;
    if (entity?.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}
