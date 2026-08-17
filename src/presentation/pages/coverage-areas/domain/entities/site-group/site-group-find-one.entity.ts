import { SiteGroupFindOneProps } from '@pages/coverage-areas/domain/interfaces/site-group/site-group-find-one-props.interface';

export class SiteGroupFindOneEntity {
    constructor(private readonly props: SiteGroupFindOneProps) {}

    get uniqId(): string {
        return this.props.uniqId;
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

    get color(): string {
        return this.props.color;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: SiteGroupFindOneProps): SiteGroupFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new SiteGroupFindOneEntity(props);
    }
}
