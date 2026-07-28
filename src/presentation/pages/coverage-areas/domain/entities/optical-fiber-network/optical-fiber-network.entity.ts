import {
    Status,
    StatusStyle,
} from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-status.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';
import { FiberType } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-type.enum';
import { OpticalFiberNetworkProps } from '@pages/coverage-areas/domain/interfaces/optical-fiber-network/optical-fiber-network-props.interface';

export class OpticalFiberNetworkEntity {
    constructor(private readonly props: OpticalFiberNetworkProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get actionsRef(): string {
        return this.props.name;
    }

    get name(): string {
        return this.props.name;
    }

    get operator(): Operator {
        return this.props.operator;
    }

    get fiberConstructorId(): string {
        return this.props.fiberConstructorId;
    }

    get fiberConstructorName(): string {
        return this.props.fiberConstructorName;
    }

    get type(): FiberType {
        return this.props.type;
    }

    get status(): Status {
        return this.props.status;
    }

    statusStyle(status: Status): StatusStyle {
        const methodMap: Record<Status, StatusStyle> = {
            [Status.ACTIVE]: StatusStyle.ACTIVE,
            [Status.INACTIVE]: StatusStyle.INACTIVE,
        };
        return methodMap[status];
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: OpticalFiberNetworkProps): OpticalFiberNetworkEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new OpticalFiberNetworkEntity(props);
    }
}
