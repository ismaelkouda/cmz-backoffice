import { ProfilsHabilitationsFilterDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-filter.dto';

export class ProfilsHabilitationsFilterVo {
    public readonly search?: string;
    public readonly user?: string;
    public readonly isActive?: boolean;

    constructor(props: { search?: string; user?: string; isActive?: boolean }) {
        this.search = props.search;
        this.user = props.user;
        this.isActive = props.isActive;
    }

    static fromDto(
        dto: ProfilsHabilitationsFilterDto | null = {} as ProfilsHabilitationsFilterDto
    ): ProfilsHabilitationsFilterVo {
        return new ProfilsHabilitationsFilterVo({
            search: dto?.search?.trim() || undefined,
            user: dto?.user,
            isActive: dto?.isActive,
        });
    }
}
