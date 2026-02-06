import { ProfilsHabilitationsUsersFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-users-filter.vo';

export class ProfilsHabilitationsUsersFilterEntity {
    constructor(
        public readonly uniqId: string,
        public readonly search?: string,
        public readonly userEmail?: string,
        public readonly phone?: string
    ) {}

    static toEntity(
        vo: ProfilsHabilitationsUsersFilterVo
    ): ProfilsHabilitationsUsersFilterEntity {
        return new ProfilsHabilitationsUsersFilterEntity(
            vo.uniqId,
            vo.search ?? undefined,
            vo.userEmail ?? undefined,
            vo.phone ?? undefined
        );
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
            search: this.search,
            userEmail: this.userEmail,
            phone: this.phone,
        });
    }
}
