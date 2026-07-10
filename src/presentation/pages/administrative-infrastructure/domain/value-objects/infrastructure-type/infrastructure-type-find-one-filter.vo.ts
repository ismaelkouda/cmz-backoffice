import { InfrastructureTypeFindOneFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-find-one-filter.dto';

export class InfrastructureTypeFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: InfrastructureTypeFindOneFilterDto
    ): InfrastructureTypeFindOneFilterVo {
        return new InfrastructureTypeFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
