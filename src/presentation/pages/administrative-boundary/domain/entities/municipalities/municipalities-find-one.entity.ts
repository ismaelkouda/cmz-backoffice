import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';
import { MunicipalitiesFindOneProps } from '@pages/administrative-boundary/domain/interfaces/municipalities/municipalities-find-one-props.interface';
export class MunicipalitiesFindOneEntity {
    constructor(private readonly props: MunicipalitiesFindOneProps) {}

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
    get population(): number {
        return this.props.populationSize;
    }
    get infrastructure(): number {
        return this.props.infrastructureSize;
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
        props: MunicipalitiesFindOneProps
    ): MunicipalitiesFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new MunicipalitiesFindOneEntity(props);
    }
}
