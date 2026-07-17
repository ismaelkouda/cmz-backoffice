import { Technology } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-technology.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

export class MobileNetworkQuery {
    constructor(
        public readonly search?: string,
        public readonly towerTypeId?: string,
        public readonly towerSize?: number,
        public readonly technology?: Technology,
        public readonly operator?: Operator,
        public readonly radius?: number,
        public readonly startDate?: Date,
        public readonly endDate?: Date
    ) {}
}
