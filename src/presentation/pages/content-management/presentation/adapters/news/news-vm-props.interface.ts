import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/news/news-status.enum';
import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface NewsVmProps {
    uniqId: string;
    type: string;
    title: string;
    category: string;
    subCategory: string;
    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;
    createdAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
