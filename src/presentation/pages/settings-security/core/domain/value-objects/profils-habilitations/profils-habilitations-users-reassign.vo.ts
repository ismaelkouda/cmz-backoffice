import { ProfilsHabilitationsUsersReassignDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-users-reassign.dto';

export class ProfilsHabilitationsUsersReassignVo {
    public readonly uniqId: string;
    public readonly users: string[];

    constructor(props: { uniqId: string; users: string[] }) {
        this.uniqId = props.uniqId;
        this.users = props.users;
    }

    static fromDto(
        dto: ProfilsHabilitationsUsersReassignDto
    ): ProfilsHabilitationsUsersReassignVo {
        const uniqId = dto?.uniqId;
        const users = dto?.users?.map((user) => user?.trim()) || [];

        if (!uniqId) {
            throw new Error(
                'uniqId is required to reassign ProfilsHabilitations Users'
            );
        }

        if (!users.length) {
            throw new Error(
                'users is required to reassign ProfilsHabilitations Users'
            );
        }

        return new ProfilsHabilitationsUsersReassignVo({
            uniqId,
            users,
        });
    }
}
