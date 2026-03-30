import {
    Status,
    StatusStyle,
} from '@pages/settings-security/domain/enums/users/users-status.enum';
import { Profiles, ProfilesStyle } from '@shared/domain/enums/profiles.enum';
import {
    Responsibilities,
    ResponsibilitiesStyle,
} from '@shared/domain/enums/responsibilities.enum';

export interface UsersVmProps {
    uniqId: string;

    lastName: string;
    firstName: string;
    email: string;
    phone: string;

    responsibility: Responsibilities;
    responsibilityLabel: string;
    responsibilityStyle: ResponsibilitiesStyle;

    profile: Profiles;
    profileLabel: string;
    profileStyle: ProfilesStyle;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    updatedAt: string;
    actionsRef: string;
}
