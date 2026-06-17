import { Status } from '@pages/administrative-boundary/domain/enums/regions/regions-status.enum';
import { RegionsFindOneProps } from '@pages/administrative-boundary/domain/interfaces/regions/regions-find-one-props.interface';
export class RegionsFindOneEntity {
    constructor(private readonly props: RegionsFindOneProps) {}

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
    get population(): number {
        return this.props.populationSize;
    }
    get infrastructure(): number {
        return this.props.infrastructureSize;
    }
    get departmentsCount(): number {
        return this.props.departmentsCount;
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

    public with(dto: RegionsFindOneProps): RegionsFindOneEntity {
        if (this.updatedAt === dto.updatedAt && this.uniqId === dto.uniqId) {
            return this;
        }
        return new RegionsFindOneEntity(dto);
    }
}
