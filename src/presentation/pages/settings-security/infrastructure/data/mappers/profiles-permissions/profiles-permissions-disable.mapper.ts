import { ProfilesPermissionsDisableEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-disable.entity';
import { ProfilesPermissionsDisableApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-disable-api.dto';

export function profilesPermissionsDisableMapper(
    vo: ProfilesPermissionsDisableEntity
): ProfilesPermissionsDisableApiDto {
    const prams = {} as ProfilesPermissionsDisableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
