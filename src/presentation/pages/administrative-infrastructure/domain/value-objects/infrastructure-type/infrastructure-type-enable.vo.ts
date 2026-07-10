import { InfrastructureTypeEnableDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-enable.dto';

export class InfrastructureTypeEnableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: InfrastructureTypeEnableDto
    ): InfrastructureTypeEnableVo {
        return new InfrastructureTypeEnableVo({
            uniqId: dto.uniqId,
        });
    }
}
