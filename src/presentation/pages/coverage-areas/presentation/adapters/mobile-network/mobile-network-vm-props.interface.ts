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
    siteGroupName: string;
    towerTypeId: string | number;
    towerTypeName: string;
    towerHeight: string;
    networkTechnology: string;
    operator: Operator;
    coverageRadius?: number;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    updatedAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
