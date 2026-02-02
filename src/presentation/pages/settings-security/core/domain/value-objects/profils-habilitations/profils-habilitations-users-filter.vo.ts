import { ProfilsHabilitationsUsersFilterDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-users-filter.dto';

export class ProfilsHabilitationsUsersFilterVo {
    public readonly uniqId: string;
    public readonly search?: string;
    public readonly userEmail?: string;
    public readonly phone?: string;

    constructor(props: {
        uniqId: string;
        search?: string;
        userEmail?: string;
        phone?: string;
    }) {
        this.uniqId = props.uniqId;
        this.search = props.search;
        this.userEmail = props.userEmail;
        this.phone = props.phone;
    }

    static fromDto(
        dto: ProfilsHabilitationsUsersFilterDto | null = {} as ProfilsHabilitationsUsersFilterDto
    ): ProfilsHabilitationsUsersFilterVo {
        const uniqId = dto?.uniqId;
        const search = dto?.search?.trim() || undefined;
        const userEmail = dto?.userEmail?.trim() || undefined;
        const phone = dto?.phone?.trim() || undefined;

        if (!uniqId) {
            throw new Error(
                'uniqId is required to get ProfilsHabilitations Users'
            );
        }

        return new ProfilsHabilitationsUsersFilterVo({
            uniqId,
            search,
            userEmail,
            phone,
        });
    }
}
