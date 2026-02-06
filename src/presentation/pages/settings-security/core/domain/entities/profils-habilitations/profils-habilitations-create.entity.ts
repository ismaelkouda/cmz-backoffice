import { ProfilsHabilitationsCreateVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-create.vo';

export class ProfilsHabilitationsCreateEntity {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly permissions: string[]
    ) {}

    static fromVo(
        vo: ProfilsHabilitationsCreateVo
    ): ProfilsHabilitationsCreateEntity {
        return new ProfilsHabilitationsCreateEntity(
            vo.name,
            vo.description,
            vo.permissions
        );
    }
}
