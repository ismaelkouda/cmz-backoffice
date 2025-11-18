import { T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM } from '../interfaces/managed-customers-buttons-actions.enum';

export interface ManagedCustomersPageActionsType {
    data: string;
    action: T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM;
    view: 'page';
}
