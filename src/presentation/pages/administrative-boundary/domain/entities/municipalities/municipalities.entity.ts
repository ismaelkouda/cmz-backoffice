import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';
import { MunicipalitiesProps } from '@pages/administrative-boundary/domain/interfaces/municipalities/municipalities-props.interface';

export class MunicipalitiesEntity {
    constructor(private readonly props: MunicipalitiesProps) {}

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
    get region(): string {
        return this.props.region;
    }
    get department(): string {
        return this.props.department;
    }
    get populationSize(): number {
        return this.props.populationSize;
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

    public with(props: MunicipalitiesProps): MunicipalitiesEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new MunicipalitiesEntity(props);
    }
}
