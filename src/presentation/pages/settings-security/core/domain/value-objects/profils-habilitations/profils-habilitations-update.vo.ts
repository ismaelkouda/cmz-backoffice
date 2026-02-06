import { ProfilsHabilitationsUpdateDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-update.dto';

export class ProfilsHabilitationsUpdateVo {
    readonly uniqId: string;
    readonly name: string;
    readonly description: string;
    readonly permissions: string[];

    private constructor(props: {
        uniqId: string;
        name: string;
        description: string;
        permissions: string[];
    }) {
        this.uniqId = props.uniqId;
        this.name = props.name;
        this.description = props.description;
        this.permissions = props.permissions;
    }

    static fromDto(
        dto: ProfilsHabilitationsUpdateDto
    ): ProfilsHabilitationsUpdateVo {
        return new ProfilsHabilitationsUpdateVo({
            uniqId: dto.uniqId,
            name: dto.name,
            description: dto.description,
            permissions: dto.permissions,
        });
    }
}
