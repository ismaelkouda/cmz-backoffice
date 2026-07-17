import {
    Status,
    StatusStyle,
} from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-status.enum';
import { Technology } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-technology.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';
import { MobileNetworkProps } from '@pages/coverage-areas/domain/interfaces/mobile-network/mobile-network-props.interface';

export class MobileNetworkEntity {
    constructor(private readonly props: MobileNetworkProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get actionsRef(): string {
        return this.props.siteName;
    }

    get siteId(): string {
        return this.props.siteId;
    }

    get siteName(): string {
        return this.props.siteName;
    }

    get towerTypeId(): string {
        return this.props.towerTypeId;
    }

    get towerTypeName(): string {
        return this.props.towerTypeName;
    }

    get towerSize(): number {
        return this.props.towerSize;
    }

    get technology(): Technology {
        return this.props.technology;
    }

    get operator(): Operator {
        return this.props.operator;
    }

    get radius(): number | undefined {
        return this.props.radius;
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

    public with(props: MobileNetworkProps): MobileNetworkEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new MobileNetworkEntity(props);
    }
}
