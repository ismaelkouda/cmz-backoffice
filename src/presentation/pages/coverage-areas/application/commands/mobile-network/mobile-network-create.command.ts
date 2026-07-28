import { Technology } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-technology.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

export class MobileNetworkCreateCommand {
    constructor(
        public readonly siteId: string | undefined,
        public readonly siteName: string | undefined,
        public readonly infrastructureType: string | undefined,
        public readonly towerTypeId: string | undefined,
        public readonly towerSize: number | undefined,
        public readonly technology: Technology[] | undefined,
        public readonly operator: Operator | undefined,
        public readonly radius: number | undefined
    ) {}
}
