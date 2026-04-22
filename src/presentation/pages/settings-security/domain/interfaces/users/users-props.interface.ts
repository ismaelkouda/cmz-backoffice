import { Status } from '@pages/settings-security/domain/enums/users/users-status.enum';
// import { Profiles } from '@shared/domain/enums/profiles.enum';
import { Roles } from '@shared/domain/enums/roles.enum';

export interface UsersProps {
    uniqId: string;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    profile: string;
    role: Roles;
    status: Status;
    updatedAt: string;
}
