import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';
import { Platform, PlatformStyle } from '@shared/domain/enums/platform.enum';

export interface SlideVmProps {
    uniqId: string;
    type: string;
    title: string;
    subtitle: string;
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
