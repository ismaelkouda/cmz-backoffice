import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export interface InfrastructureFindOneProps {
    uniqId: string;
    name: string;
    type: string;
    description: string;
    region: string;
    department: string;
    municipality: string;
    position: Coordinates;
    createdAt: string;
    updatedAt: string;
}
export class InfrastructureFindOneEntity {
    constructor(private readonly props: InfrastructureFindOneProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get name(): string {
        return this.props.name;
    }

    get type(): string {
        return this.props.type;
    }

    get description(): string {
        return this.props.description;
    }

    get region(): string {
        return this.props.region;
    }

    get department(): string {
        return this.props.department;
    }

    get municipality(): string {
        return this.props.municipality;
    }

    get position(): Coordinates {
        return this.props.position;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(
        props: InfrastructureFindOneProps
    ): InfrastructureFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new InfrastructureFindOneEntity(props);
    }
}
