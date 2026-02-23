import { Status } from '@presentation/pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';

export interface ProfilesPermissionsProps {
    uniqId: string;
    name: string;
    slug: string;
    description: string;
    totalUsers: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
