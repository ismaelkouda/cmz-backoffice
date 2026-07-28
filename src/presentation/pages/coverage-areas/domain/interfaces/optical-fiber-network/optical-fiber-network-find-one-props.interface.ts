import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';
import { FiberType } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-type.enum';

export interface OpticalFiberNetworkFindOneProps {
    uniqId: string;
    name: string;
    operator: Operator;
    fiberConstructorId: string;
    fiberConstructorName: string;
    type: FiberType;
    geomUrl?: string;
    geom?: object;
    updatedAt: string;
}
