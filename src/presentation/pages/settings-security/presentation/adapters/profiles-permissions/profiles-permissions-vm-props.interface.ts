import {
    Status,
    StatusStyle,
} from '@pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';
import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface ProfilesPermissionsVmProps {
    uniqId: string;

    name: string;
    description: string;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    usersCount: string;

    updatedAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
