import {
    Status,
    StatusStyle,
} from '@pages/coverage-areas/domain/enums/site-group/site-group-status.enum';
import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface SiteGroupVmProps {
    uniqId: string;

    code: string;
    name: string;
    description?: string;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    updatedAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
