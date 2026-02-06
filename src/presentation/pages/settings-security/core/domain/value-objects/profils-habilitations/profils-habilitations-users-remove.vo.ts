import { ProfilsHabilitationsUsersRemoveDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-users-remove.dto';

export class ProfilsHabilitationsUsersRemoveVo {
    public readonly uniqId: string;
    public readonly users: string[];

    constructor(props: { uniqId: string; users: string[] }) {
        this.uniqId = props.uniqId;
        this.users = props.users;
    }

    static fromDto(
        dto: ProfilsHabilitationsUsersRemoveDto
    ): ProfilsHabilitationsUsersRemoveVo {
        const uniqId = dto?.uniqId;
        const users = dto?.users?.map((user) => user?.trim()) || [];

        if (!uniqId) {
            throw new Error(
                'uniqId is required to remove ProfilsHabilitations Users'
            );
        }

        if (!users.length) {
            throw new Error(
                'users is required to remove ProfilsHabilitations Users'
            );
        }

        return new ProfilsHabilitationsUsersRemoveVo({
            uniqId,
            users,
        });
    }
}
