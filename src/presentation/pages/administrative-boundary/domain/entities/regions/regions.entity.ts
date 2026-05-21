import { Status } from '@pages/administrative-boundary/domain/enums/regions/regions-status.enum';
import { RegionsProps } from '@pages/administrative-boundary/domain/interfaces/regions/regions-props.interface';

export class RegionsEntity {
    constructor(public readonly props: RegionsProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get name(): string {
        return this.props.name;
    }
    get code(): string {
        return this.props.code;
    }
    get description(): string {
        return this.props.description;
    }
    get populationSize(): number {
        return this.props.populationSize;
    }
    get departmentsCount(): number {
        return this.props.departmentsCount;
    }
    get municipalitiesCount(): number {
        return this.props.municipalitiesCount;
    }
    get infrastructureCount(): number {
        return this.props.infrastructureCount;
    }
    get status(): Status {
        return this.props.status;
    }
    get createdAt(): string {
        return this.props.createdAt;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    get actionsRef(): string {
        return this.props.code;
    }

    public with(props: RegionsProps): RegionsEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new RegionsEntity(props);
    }
}
