import { ProfilsHabilitationsFindOneFilterDto } from '../../../application/dtos/profils-habilitations/profils-habilitations-findone-filter.dto';

export class ProfilsHabilitationsFindOneFilterVo {
    public readonly uniqId?: string;

    constructor(props: { uniqId?: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: ProfilsHabilitationsFindOneFilterDto | null = {} as ProfilsHabilitationsFindOneFilterDto
    ): ProfilsHabilitationsFindOneFilterVo {
        return new ProfilsHabilitationsFindOneFilterVo({
            uniqId: dto?.uniqId,
        });
    }
}
