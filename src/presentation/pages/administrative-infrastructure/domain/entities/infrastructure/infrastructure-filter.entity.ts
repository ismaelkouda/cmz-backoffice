import { InfrastructureFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-filter.vo';

export class InfrastructureFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly type?: string,
        public readonly region?: string,
        public readonly department?: string,
        public readonly municipality?: string,
        public readonly position?: string
    ) {}

    static fromVo(vo: InfrastructureFilterVo): InfrastructureFilterEntity {
        return new InfrastructureFilterEntity(
            vo.search,
            vo.type,
            vo.region,
            vo.department,
            vo.municipality,
            vo.position
        );
    }
}
