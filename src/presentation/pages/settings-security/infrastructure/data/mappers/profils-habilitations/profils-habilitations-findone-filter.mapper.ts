import { ProfilsHabilitationsFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-findone-filter.entity';
import { ProfilsHabilitationsFindOneFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-findone-filter-api.dto';

export function profilsHabilitationsFindOneFilterMapper(
    entity?: ProfilsHabilitationsFindOneFilterEntity
): ProfilsHabilitationsFindOneFilterApiDto | undefined {
    const params: ProfilsHabilitationsFindOneFilterApiDto =
        {} as ProfilsHabilitationsFindOneFilterApiDto;
    if (entity?.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}
