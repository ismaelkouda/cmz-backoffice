import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface RegionsVmProps {
    uniqId: string;

    code: string;
    name: string;
    description: string;

    populationSize: number;
    departmentsCount: number;
    infrastructureCount: number;

    updatedAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
