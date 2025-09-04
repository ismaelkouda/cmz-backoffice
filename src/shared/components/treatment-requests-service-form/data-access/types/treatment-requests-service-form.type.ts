import { T_REQUESTS_SERVICE_TREATMENT_ENUM } from '../../../../../presentation/pages/requests-service/data-access/requests-service/enums/requests-service-treatment.enum';
import { T_MODULE_TREATMENT_CUSTOMERS_ACTIVATE } from '../../../../enum/module-treatment-customers-activate';

export type T_HandleTreatment = {
    module: T_MODULE_TREATMENT_CUSTOMERS_ACTIVATE;
    typeTreatment: T_REQUESTS_SERVICE_TREATMENT_ENUM;
};
