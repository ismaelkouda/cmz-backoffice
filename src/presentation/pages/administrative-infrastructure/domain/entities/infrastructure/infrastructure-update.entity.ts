import { InfrastructureUpdateVo } from '../../value-objects/infrastructure/infrastructure-update.vo';

export class InfrastructureUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly type: string,
        public readonly description: string,
        public readonly region: string,
        public readonly department: string,
        public readonly municipality: string,
        public readonly position: string
    ) {}
    static fromVo(vo: InfrastructureUpdateVo): InfrastructureUpdateEntity {
        return new InfrastructureUpdateEntity(
            vo.uniqId,
            vo.name,
            vo.type,
            vo.description,
            vo.region,
            vo.region,
            vo.department,
            vo.municipality
        );
    }
}
