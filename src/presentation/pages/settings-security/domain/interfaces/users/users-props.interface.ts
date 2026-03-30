import { Status } from '@pages/settings-security/domain/enums/users/users-status.enum';
import { Profiles } from '@shared/domain/enums/profiles.enum';
import { Responsibilities } from '@shared/domain/enums/responsibilities.enum';

export interface UsersProps {
    uniqId: string;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    profile: Profiles;
    responsibility: Responsibilities;
    status: Status;
    updatedAt: string;
}
