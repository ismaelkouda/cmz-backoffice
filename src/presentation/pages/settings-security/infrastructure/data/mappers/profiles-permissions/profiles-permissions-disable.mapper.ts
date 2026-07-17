import { ProfilesPermissionsDisableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-disable.dto';
import { ProfilesPermissionsDisableApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-disable-api.dto';

export function profilesPermissionsDisableMapper(
    dto: ProfilesPermissionsDisableDto
): ProfilesPermissionsDisableApiDto {
    const prams = {} as ProfilesPermissionsDisableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
