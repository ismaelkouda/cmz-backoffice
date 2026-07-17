import { ProfilesPermissionsEnableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-enable.dto';
import { ProfilesPermissionsEnableApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-enable-api.dto';

export function profilesPermissionsEnableMapper(
    dto: ProfilesPermissionsEnableDto
): ProfilesPermissionsEnableApiDto {
    const prams = {} as ProfilesPermissionsEnableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
