import { InfrastructureTypeUpdateVo } from '../../value-objects/infrastructure-type/infrastructure-type-update.vo';

export class InfrastructureTypeUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly description: string
    ) {}
    static fromVo(
        vo: InfrastructureTypeUpdateVo
    ): InfrastructureTypeUpdateEntity {
        return new InfrastructureTypeUpdateEntity(
            vo.uniqId,
            vo.name,
            vo.description
        );
    }
}
