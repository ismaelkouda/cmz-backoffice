import { ProfilsHabilitationsFreeUsersAssignDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-free-users-assign.dto';

export class ProfilsHabilitationsFreeUsersAssignVo {
    public readonly uniqId: string;
    public readonly users: string[];

    constructor(props: { uniqId: string; users: string[] }) {
        this.uniqId = props.uniqId;
        this.users = props.users;
    }

    static fromDto(
        dto: ProfilsHabilitationsFreeUsersAssignDto
    ): ProfilsHabilitationsFreeUsersAssignVo {
        const uniqId = dto?.uniqId;
        const users = dto?.users?.map((user) => user?.trim()) || [];

        if (!uniqId) {
            throw new Error(
                'uniqId is required to assign ProfilsHabilitations Users'
            );
        }

        if (!users.length) {
            throw new Error(
                'users is required to assign ProfilsHabilitations Users'
            );
        }

        return new ProfilsHabilitationsFreeUsersAssignVo({
            uniqId,
            users,
        });
    }
}
