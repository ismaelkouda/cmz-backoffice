import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface SlaVmProps {
    id: string;
    name: string;
    description: string;
    category: string;
    categoryLabel: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    statusLabel: string;
    dropdownActions: ActionDropdownItem[];
    disableDropdown: boolean;
    tooltipDropdown: string;
}
