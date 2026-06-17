import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';
import { DepartmentsFindOneProps } from '@pages/administrative-boundary/domain/interfaces/departments/departments-find-one-props.interface';

export class DepartmentsFindOneEntity {
    constructor(private readonly props: DepartmentsFindOneProps) {}

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
    get population(): number {
        return this.props.populationSize;
    }
    get infrastructure(): number {
        return this.props.infrastructureSize;
    }
    get municipalitiesCount(): number {
        return this.props.municipalitiesCount;
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

    public with(props: DepartmentsFindOneProps): DepartmentsFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new DepartmentsFindOneEntity(props);
    }
}
