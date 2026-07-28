import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';

export class OpticalFiberNetworkQuery {
    constructor(
        public readonly search?: string,
        public readonly operator?: Operator,
        public readonly startDate?: Date,
        public readonly endDate?: Date
    ) {}
}
