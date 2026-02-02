import { ProfilsHabilitationsCreateDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-create.dto';

export class ProfilsHabilitationsCreateVo {
    readonly name: string;
    readonly description: string;
    readonly permissions: string[];

    private constructor(props: {
        name: string;
        description: string;
        permissions: string[];
    }) {
        this.name = props.name;
        this.description = props.description;
        this.permissions = props.permissions;
    }

    static fromDto(
        dto: ProfilsHabilitationsCreateDto
    ): ProfilsHabilitationsCreateVo {
        return new ProfilsHabilitationsCreateVo({
            name: dto.name,
            description: dto.description,
            permissions: dto.permissions,
        });
    }
}
