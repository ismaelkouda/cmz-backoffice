import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';
import { FiberType } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-type.enum';

export interface OpticalFiberNetworkUpdateDto {
    uniqId: string;
    name?: string;
    operator?: Operator;
    fiberConstructorId?: string;
    type?: FiberType;
    geomFile?: File;
}
