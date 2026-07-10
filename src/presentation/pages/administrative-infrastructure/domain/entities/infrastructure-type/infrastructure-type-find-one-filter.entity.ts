import { InfrastructureTypeFindOneFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-find-one-filter.vo';

export class InfrastructureTypeFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: InfrastructureTypeFindOneFilterVo
    ): InfrastructureTypeFindOneFilterEntity {
        return new InfrastructureTypeFindOneFilterEntity(vo.uniqId);
    }
}
