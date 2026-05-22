import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/legal-notice/legal-notice-status.enum';
import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface LegalNoticeVmProps {
    uniqId: string;
    version: string;
    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;
    createdAt: string;
    publishedAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
