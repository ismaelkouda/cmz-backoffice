import { ProfilsHabilitationsUsersRemoveVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-users-remove.vo';

export class ProfilsHabilitationsUsersRemoveEntity {
    constructor(
        public readonly uniqId: string,
        public readonly users: string[]
    ) {}

    static toEntity(
        vo: ProfilsHabilitationsUsersRemoveVo
    ): ProfilsHabilitationsUsersRemoveEntity {
        return new ProfilsHabilitationsUsersRemoveEntity(vo.uniqId, vo.users);
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
            users: this.users,
        });
    }
}
