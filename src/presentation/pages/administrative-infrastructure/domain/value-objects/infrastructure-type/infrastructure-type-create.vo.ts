import { InfrastructureTypeCreateDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-create.dto';

export class InfrastructureTypeCreateVo {
    public readonly name: string;
    public readonly description: string;

    constructor(props: { name: string; description: string }) {
        this.name = props.name;
        this.description = props.description;
    }

    static fromDto(
        dto: InfrastructureTypeCreateDto
    ): InfrastructureTypeCreateVo {
        return new InfrastructureTypeCreateVo({
            name: dto.name,
            description: dto.description,
        });
    }
}
