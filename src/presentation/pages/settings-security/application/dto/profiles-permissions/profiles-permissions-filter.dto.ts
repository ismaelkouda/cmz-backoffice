import { Status } from '@pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';
export interface ProfilesPermissionsFilterDto {
    search?: string;
    user?: string;
    status?: Status;
}
