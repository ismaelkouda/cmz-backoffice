import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';
import { FiberType } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-type.enum';

export class OpticalFiberNetworkUpdateCommand {
    constructor(
        public readonly uniqId: string,
        public readonly name: string | undefined,
        public readonly operator: Operator | undefined,
        public readonly fiberConstructorId: string | undefined,
        public readonly type: FiberType | undefined,
        public readonly geomFile: File | undefined
    ) {}
}
