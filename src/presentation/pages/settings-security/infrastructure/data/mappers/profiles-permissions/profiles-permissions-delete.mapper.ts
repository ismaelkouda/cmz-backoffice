import { ProfilesPermissionsDeleteEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-delete.entity';
import { ProfilesPermissionsDeleteApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-delete-api.dto';

export function profilesPermissionsDeleteMapper(
    vo: ProfilesPermissionsDeleteEntity
): ProfilesPermissionsDeleteApiDto {
    const prams = {} as ProfilesPermissionsDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
