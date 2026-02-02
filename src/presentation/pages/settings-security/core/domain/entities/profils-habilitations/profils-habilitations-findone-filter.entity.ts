import { ProfilsHabilitationsFindOneFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-findone-filter.vo';

export class ProfilsHabilitationsFindOneFilterEntity {
    constructor(public readonly uniqId?: string) {}

    static fromVo(
        vo?: ProfilsHabilitationsFindOneFilterVo
    ): ProfilsHabilitationsFindOneFilterEntity {
        return new ProfilsHabilitationsFindOneFilterEntity(vo?.uniqId);
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
        });
    }
}
