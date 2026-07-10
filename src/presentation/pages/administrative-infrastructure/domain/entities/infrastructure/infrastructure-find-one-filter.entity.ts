import { InfrastructureFindOneFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-find-one-filter.vo';

export class InfrastructureFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: InfrastructureFindOneFilterVo
    ): InfrastructureFindOneFilterEntity {
        return new InfrastructureFindOneFilterEntity(vo.uniqId);
    }
}
