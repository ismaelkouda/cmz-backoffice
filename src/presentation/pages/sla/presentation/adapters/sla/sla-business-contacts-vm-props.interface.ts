import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface SlaBusinessContactsVmProps {
    id: string | number;
    lastName: string;
    firstName: string;
    phone: string;
    email: string;
    indicatorsCount: number;
    statusLabel: string;
    statusStyle: string;
    createdAt: string;
    dropdownActions: ActionDropdownItem[];
    disableDropdown: boolean;
    tooltipDropdown: string;
}
