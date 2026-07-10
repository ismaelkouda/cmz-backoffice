import { InfrastructureFindOneFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-find-one-filter.dto';

export class InfrastructureFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: InfrastructureFindOneFilterDto
    ): InfrastructureFindOneFilterVo {
        return new InfrastructureFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
