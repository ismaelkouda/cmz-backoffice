import { T_INVOICE_BUTTONS_ACTIONS_ENUM } from '../enums/invoice-buttons-actions.enum';
import { InvoiceInterface } from '../interface/invoice.interface';

export type InvoicePageActionsType = {
    data: InvoiceInterface;
    action: T_INVOICE_BUTTONS_ACTIONS_ENUM;
    view: 'page';
};
