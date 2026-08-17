import {
    Status,
    StatusStyle,
} from '@presentation/pages/administrative-infrastructure/domain/enums/infrastructure-type/infrastructure-type-status.enum';
import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface InfrastructureTypeVmProps {
    uniqId: string;

    name: string;
    description: string;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    updatedAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
