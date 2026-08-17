import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/home/home-status.enum';
import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';
import { Platform, PlatformStyle } from '@shared/domain/enums/platform.enum';

export interface HomeVmProps {
    uniqId: string;
    title: string;
    platforms: Platform[];
    platformsStyle: (platform: Platform) => PlatformStyle;
    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;
    createdAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
