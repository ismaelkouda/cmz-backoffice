import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface MunicipalitiesVmProps {
    uniqId: string;

    code: string;
    name: string;
    region: string;
    department: string | null;
    description: string;

    populationSize: number;
    infrastructureCount: number;

    updatedAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
