import { InfrastructureTypeDisableDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-disable.dto';

export class InfrastructureTypeDisableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: InfrastructureTypeDisableDto
    ): InfrastructureTypeDisableVo {
        return new InfrastructureTypeDisableVo({
            uniqId: dto.uniqId,
        });
    }
}
