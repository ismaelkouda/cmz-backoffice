import { SlaProps } from '@pages/sla/domain/interfaces/sla/sla-props.interface';

export class SlaEntity implements SlaProps {
    constructor(private readonly props: SlaProps) {}

    get id(): string {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get description(): string {
        return this.props.description;
    }

    get category(): string {
        return this.props.category;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    get createdAt(): string {
        return this.props.createdAt;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: SlaProps): SlaEntity {
        if (this.updatedAt === props.updatedAt && this.id === props.id) {
            return this;
        }
        return new SlaEntity(props);
    }
}
