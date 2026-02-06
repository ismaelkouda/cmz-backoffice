import { ProfilsHabilitationsFreeUsersAssignVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-free-users-assign.vo';

export class ProfilsHabilitationsFreeUsersAssignEntity {
    constructor(
        public readonly uniqId: string,
        public readonly users: string[]
    ) {}

    static toEntity(
        vo: ProfilsHabilitationsFreeUsersAssignVo
    ): ProfilsHabilitationsFreeUsersAssignEntity {
        return new ProfilsHabilitationsFreeUsersAssignEntity(
            vo.uniqId,
            vo.users
        );
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
            users: this.users,
        });
    }
}
