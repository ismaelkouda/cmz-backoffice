import { Status } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-status.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';
import { FiberType } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-type.enum';

export interface OpticalFiberNetworkProps {
    uniqId: string;
    name: string;
    operator: Operator;
    fiberConstructorId: string;
    fiberConstructorName: string;
    type: FiberType;
    status: Status;
    updatedAt: string;
}
