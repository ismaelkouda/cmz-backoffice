import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';
import { MobileNetworkFindOneProps } from '@pages/coverage-areas/domain/interfaces/mobile-network/mobile-network-find-one-props.interface';

export class MobileNetworkFindOneEntity {
    constructor(private readonly props: MobileNetworkFindOneProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get siteId(): string {
        return this.props.siteId;
    }

    get siteName(): string {
        return this.props.siteName;
    }

    get siteGroupId(): string | number {
        return this.props.siteGroupId;
    }

    get siteGroupName(): string {
        return this.props.siteGroupName;
    }

    get towerTypeId(): string | number {
        return this.props.towerTypeId;
    }

    get towerTypeName(): string {
        return this.props.towerTypeName;
    }

    get towerHeight(): string {
        return this.props.towerHeight;
    }

    get networkTechnology(): string {
        return this.props.networkTechnology;
    }

    get operator(): Operator {
        return this.props.operator;
    }

    get coverageRadius(): number | undefined {
        return this.props.coverageRadius;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: MobileNetworkFindOneProps): MobileNetworkFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new MobileNetworkFindOneEntity(props);
    }
}
