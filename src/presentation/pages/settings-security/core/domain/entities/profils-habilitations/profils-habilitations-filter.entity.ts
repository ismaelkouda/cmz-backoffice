import { ProfilsHabilitationsFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-filter.vo';

export class ProfilsHabilitationsFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly user?: string,
        public readonly isActive?: boolean
    ) {}

    static fromVo(
        vo: ProfilsHabilitationsFilterVo
    ): ProfilsHabilitationsFilterEntity {
        return new ProfilsHabilitationsFilterEntity(
            vo.search,
            vo.user,
            vo.isActive
        );
    }

    appliesToAdminScope(): boolean {
        return this.user === 'ADMIN_ACTION';
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            user: this.user,
            isActive: this.isActive,
        });
    }
}
