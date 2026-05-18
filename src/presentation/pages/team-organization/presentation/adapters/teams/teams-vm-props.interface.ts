import {
    Status,
    StatusStyle,
} from '@pages/team-organization/domain/enums/teams/teams-status.enum';
import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface TeamsVmProps {
    uniqId: string;

    code: string;
    name: string;
    description: string;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    membersCount: string;

    updatedAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
