import { InfrastructureCreateVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-create.vo';

export class InfrastructureCreateEntity {
    constructor(
        public readonly name: string,
        public readonly type: string,
        public readonly description: string,
        public readonly region: string,
        public readonly department: string,
        public readonly municipality: string,
        public readonly position: string
    ) {}

    static fromVo(vo: InfrastructureCreateVo): InfrastructureCreateEntity {
        return new InfrastructureCreateEntity(
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
