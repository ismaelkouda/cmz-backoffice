import { InfrastructureFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-filter.dto';

export class InfrastructureFilterVo {
    public readonly search?: string;
    public readonly type?: string;
    public readonly region?: string;
    public readonly department?: string;
    public readonly municipality?: string;
    public readonly position?: string;

    constructor(props: {
        search?: string;
        type?: string;
        region?: string;
        department?: string;
        municipality?: string;
        position?: string;
    }) {
        this.search = props.search;
        this.type = props.type;
        this.region = props.region;
        this.department = props.department;
        this.municipality = props.municipality;
        this.position = props.position;
    }

    static fromDto(
        dto: InfrastructureFilterDto | null = {} as InfrastructureFilterDto
    ): InfrastructureFilterVo {
        return new InfrastructureFilterVo({
            search: dto?.search?.trim() || undefined,
            type: dto?.type || undefined,
            region: dto?.region || undefined,
            department: dto?.department || undefined,
            municipality: dto?.municipality || undefined,
            position: dto?.position || undefined,
        });
    }
}
