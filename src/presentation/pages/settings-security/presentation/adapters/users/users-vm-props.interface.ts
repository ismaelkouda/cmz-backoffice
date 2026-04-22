import {
    Status,
    StatusStyle,
} from '@pages/settings-security/domain/enums/users/users-status.enum';
import { Roles, RolesStyle } from '@shared/domain/enums/roles.enum';
// import { Profiles, ProfilesStyle } from '@shared/domain/enums/profiles.enum';

export interface UsersVmProps {
    uniqId: string;

    lastName: string;
    firstName: string;
    email: string;
    phone: string;

    role: Roles;
    roleLabel: string;
    roleStyle: RolesStyle;

    profile: string;
    // profileLabel: string;
    // profileStyle: ProfilesStyle;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    updatedAt: string;
    actionsRef: string;
}
