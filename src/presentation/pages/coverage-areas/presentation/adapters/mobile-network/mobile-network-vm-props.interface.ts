import {
    Status,
    StatusStyle,
} from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-status.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';
import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface MobileNetworkVmProps {
    uniqId: string;

    siteId: string;
    siteName: string;
    towerTypeId: string;
    towerTypeName: string;
    towerSize: number;
    technology: string;
    operator: Operator;
    radius?: number;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    updatedAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
