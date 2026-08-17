import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface InfrastructureVmProps {
    uniqId: string;

    name: string;
    type: string;
    description: string;

    region: string;
    department: string;
    municipality: string;
    position: string;

    updatedAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
