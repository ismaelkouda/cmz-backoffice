import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';

export interface SlaEscalationContactCategoryVm {
    label: string;
    severity: 'info' | 'contrast' | 'secondary';
}

export interface SlaEscalationContactVmProps {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    categories: SlaEscalationContactCategoryVm[];
    categoriesLabel: string;
    statusLabel: string;
    statusStyle: string;
    updatedAt: string;
    dropdownActions: ActionDropdownItem[];
    disableDropdown: boolean;
    tooltipDropdown: string;
}
