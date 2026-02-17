import { ProfilesPermissionsEnableEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-enable.entity';
import { ProfilesPermissionsEnableApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-enable-api.dto';

export function profilesPermissionsEnableMapper(
    vo: ProfilesPermissionsEnableEntity
): ProfilesPermissionsEnableApiDto {
    const prams = {} as ProfilesPermissionsEnableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
