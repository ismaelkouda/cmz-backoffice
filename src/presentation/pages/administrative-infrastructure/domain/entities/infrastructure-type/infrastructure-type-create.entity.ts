import { InfrastructureTypeCreateVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-create.vo';

export class InfrastructureTypeCreateEntity {
    constructor(
        public readonly name: string,
        public readonly description: string
    ) {}

    static fromVo(
        vo: InfrastructureTypeCreateVo
    ): InfrastructureTypeCreateEntity {
        return new InfrastructureTypeCreateEntity(vo.name, vo.description);
    }
}
