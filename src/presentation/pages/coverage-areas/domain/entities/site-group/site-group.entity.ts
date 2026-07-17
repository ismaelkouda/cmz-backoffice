import {
    Status,
    StatusStyle,
} from '@pages/coverage-areas/domain/enums/site-group/site-group-status.enum';
import { SiteGroupProps } from '@pages/coverage-areas/domain/interfaces/site-group/site-group-props.interface';

export class SiteGroupEntity {
    constructor(private readonly props: SiteGroupProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get actionsRef(): string {
        return this.props.name;
    }

    get code(): string {
        return this.props.code;
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

    public with(props: SiteGroupProps): SiteGroupEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new SiteGroupEntity(props);
    }
}
