import {
    Status,
    StatusStyle,
} from '@pages/settings-security/domain/enums/users/users-status.enum';
import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';
import { Roles, RolesStyle } from '@shared/domain/enums/roles.enum';
// import { Profiles, ProfilesStyle } from '@shared/domain/enums/profiles.enum';

export interface UsersVmProps {
    uniqId: string;

    lastName: string;
    firstName: string;
    email: string;
    phone: string;

    role: Roles | null;
    roleLabel: string | null;
    roleStyle: RolesStyle | null;

    profile: string;
    // profileLabel: string;
    // profileStyle: ProfilesStyle;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    updatedAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
