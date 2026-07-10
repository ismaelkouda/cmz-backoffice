import { InfrastructureUpdateDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-update.dto';

export class InfrastructureUpdateVo {
    public readonly uniqId: string;
    public readonly name: string;
    public readonly type: string;
    public readonly description: string;
    public readonly region: string;
    public readonly department: string;
    public readonly municipality: string;
    public readonly position: string;

    constructor(props: {
        uniqId: string;
        name: string;
        type: string;
        description: string;
        region: string;
        department: string;
        municipality: string;
        position: string;
    }) {
        this.uniqId = props.uniqId;
        this.name = props.name;
        this.type = props.type;
        this.description = props.description;
        this.region = props.region;
        this.department = props.department;
        this.municipality = props.municipality;
        this.position = props.position;
    }

    static fromDto(dto: InfrastructureUpdateDto): InfrastructureUpdateVo {
        return new InfrastructureUpdateVo({
            uniqId: dto.uniqId,
            name: dto.name,
            type: dto.type,
            description: dto.description,
            region: dto.region,
            department: dto.department,
            municipality: dto.municipality,
            position: dto.position,
        });
    }
}
