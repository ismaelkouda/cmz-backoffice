import { InfrastructureTypeFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-filter.vo';

export class InfrastructureTypeFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly profile?: string,
        public readonly role?: string,
        public readonly isActive?: string
    ) {}

    static fromVo(
        vo: InfrastructureTypeFilterVo
    ): InfrastructureTypeFilterEntity {
        return new InfrastructureTypeFilterEntity(
            vo.search,
            vo.profile,
            vo.role,
            vo.isActive
        );
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            profile: this.profile,
            role: this.role,
            isActive: this.isActive,
        });
    }
}
