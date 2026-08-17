import {
    Status,
    StatusStyle,
} from '@presentation/pages/administrative-infrastructure/domain/enums/infrastructure-type/infrastructure-type-status.enum';
import { InfrastructureTypeProps } from '@presentation/pages/administrative-infrastructure/domain/interfaces/infrastructure-type/infrastructure-type-props.interface';

export class InfrastructureTypeEntity {
    constructor(private readonly props: InfrastructureTypeProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get actionsRef(): string {
        return this.props.name;
    }

    get name(): string {
        return this.props.name;
    }

    get description(): string {
        return this.props.description;
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

    public with(props: InfrastructureTypeProps): InfrastructureTypeEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new InfrastructureTypeEntity(props);
    }
}
