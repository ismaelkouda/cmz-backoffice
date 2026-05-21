import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface DepartmentsVmProps {
    uniqId: string;

    code: string;
    name: string;
    region: string;
    description: string;

    populationSize: number;
    municipalitiesCount: number;
    infrastructureCount: number;

    updatedAt: string;
    actionsRef: string;

    dropdownActions: ActionDropdownItem[];

    disableDropdown: boolean;
    tooltipDropdown: string;
}
