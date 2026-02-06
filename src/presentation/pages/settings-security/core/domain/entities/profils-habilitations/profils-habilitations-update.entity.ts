import { ProfilsHabilitationsUpdateVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-update.vo';

export class ProfilsHabilitationsUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly permissions: string[]
    ) {}

    static fromVo(
        vo: ProfilsHabilitationsUpdateVo
    ): ProfilsHabilitationsUpdateEntity {
        return new ProfilsHabilitationsUpdateEntity(
            vo.uniqId,
            vo.name,
            vo.description,
            vo.permissions
        );
    }
}
