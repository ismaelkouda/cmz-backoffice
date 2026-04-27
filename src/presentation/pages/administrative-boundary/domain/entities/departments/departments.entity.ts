import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';
import { DepartmentsProps } from '@pages/administrative-boundary/domain/interfaces/departments/departments-props.interface';
export class DepartmentsEntity {
    constructor(private readonly props: DepartmentsProps) {}

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
    get populationSize(): number {
        return this.props.populationSize;
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

    public with(props: DepartmentsProps): DepartmentsEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new DepartmentsEntity(props);
    }
}
