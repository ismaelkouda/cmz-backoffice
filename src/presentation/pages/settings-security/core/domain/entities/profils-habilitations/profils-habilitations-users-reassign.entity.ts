import { ProfilsHabilitationsUsersReassignVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-users-reassign.vo';

export class ProfilsHabilitationsUsersReassignEntity {
    constructor(
        public readonly uniqId: string,
        public readonly users: string[]
    ) {}

    static toEntity(
        vo: ProfilsHabilitationsUsersReassignVo
    ): ProfilsHabilitationsUsersReassignEntity {
        return new ProfilsHabilitationsUsersReassignEntity(vo.uniqId, vo.users);
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
            users: this.users,
        });
    }
}
