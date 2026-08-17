export interface ActionDropdownItem<T = unknown> {
    id: string;
    label: string;
    icon?: string;

    hidden?: boolean;
    disabled?: boolean;

    tooltip?: string;

    severity?: 'primary' | 'success' | 'warning' | 'danger';

    data?: T;
}
