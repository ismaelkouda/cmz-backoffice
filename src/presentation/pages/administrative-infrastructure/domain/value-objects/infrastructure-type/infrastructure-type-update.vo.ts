import { InfrastructureTypeUpdateDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-update.dto';

export class InfrastructureTypeUpdateVo {
    public readonly uniqId: string;
    public readonly name: string;
    public readonly description: string;

    constructor(props: { uniqId: string; name: string; description: string }) {
        this.uniqId = props.uniqId;
        this.name = props.name;
        this.description = props.description;
    }

    static fromDto(
        dto: InfrastructureTypeUpdateDto
    ): InfrastructureTypeUpdateVo {
        return new InfrastructureTypeUpdateVo({
            uniqId: dto.uniqId,
            name: dto.name,
            description: dto.description,
        });
    }
}
