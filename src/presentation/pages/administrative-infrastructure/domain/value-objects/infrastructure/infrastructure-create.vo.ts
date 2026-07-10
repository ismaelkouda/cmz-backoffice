import { InfrastructureCreateDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-create.dto';

export class InfrastructureCreateVo {
    name: string;
    type: string;
    description: string;
    region: string;
    department: string;
    municipality: string;
    position: string;

    constructor(props: {
        name: string;
        type: string;
        description: string;
        region: string;
        department: string;
        municipality: string;
        position: string;
    }) {
        this.name = props.name;
        this.type = props.type;
        this.description = props.description;
        this.region = props.region;
        this.department = props.department;
        this.municipality = props.municipality;
        this.position = props.position;
    }

    static fromDto(dto: InfrastructureCreateDto): InfrastructureCreateVo {
        return new InfrastructureCreateVo({
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
