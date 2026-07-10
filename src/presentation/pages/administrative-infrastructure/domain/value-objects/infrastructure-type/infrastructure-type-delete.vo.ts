import { InfrastructureTypeDeleteDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-delete.dto';

export class InfrastructureTypeDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: InfrastructureTypeDeleteDto
    ): InfrastructureTypeDeleteVo {
        return new InfrastructureTypeDeleteVo({
            uniqId: dto.uniqId,
        });
    }
}
