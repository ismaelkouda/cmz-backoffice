import { T_REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM } from '../../requests-service/enums/requests-service-buttons-actions.enum';

export interface CustomersActivatePageActionsType {
    data: string;
    action: T_REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM;
    view: 'page' | 'modal';
}
