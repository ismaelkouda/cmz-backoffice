import { ProfilesPermissionsFilterDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-filter.dto';
import { Status } from '@pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';

export interface ProfilesPermissionsFilterVo {
    search?: string;
    user?: string;
    status?: Status;
}

export function profilesPermissionsFilterVo(
    dto: ProfilesPermissionsFilterDto | null = {} as ProfilesPermissionsFilterDto
): ProfilesPermissionsFilterVo {
    return {
        search: dto?.search?.trim() || undefined,
        user: dto?.user,
        status: dto?.status,
    };
}
