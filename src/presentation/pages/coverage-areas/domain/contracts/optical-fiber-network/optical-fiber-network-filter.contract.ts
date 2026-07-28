import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';

export interface OpticalFiberNetworkFilterContract {
    search?: string;
    operator?: Operator;
    startDate?: Date;
    endDate?: Date;
}
