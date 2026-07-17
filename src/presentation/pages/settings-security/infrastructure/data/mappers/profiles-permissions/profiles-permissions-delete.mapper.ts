import { ProfilesPermissionsDeleteDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-delete.dto';
import { ProfilesPermissionsDeleteApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-delete-api.dto';

export function profilesPermissionsDeleteMapper(
    dto: ProfilesPermissionsDeleteDto
): ProfilesPermissionsDeleteApiDto {
    const prams = {} as ProfilesPermissionsDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
