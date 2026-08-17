import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';
import { MunicipalitiesByDepartmentIdProps } from '@pages/administrative-boundary/domain/interfaces/departments/municipalities-by-department-id-props.interface';

export class MunicipalitiesByDepartmentIdEntity {
    constructor(private readonly props: MunicipalitiesByDepartmentIdProps) {}

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
    get status(): Status {
        return this.props.status;
    }
    get createdAt(): string {
        return this.props.createdAt;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(
        props: MunicipalitiesByDepartmentIdProps
    ): MunicipalitiesByDepartmentIdEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new MunicipalitiesByDepartmentIdEntity(props);
    }
}
