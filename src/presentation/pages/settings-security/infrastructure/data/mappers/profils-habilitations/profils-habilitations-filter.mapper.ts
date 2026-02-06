import { ProfilsHabilitationsFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-filter.entity';
import { ProfilsHabilitationsFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-filter-api.dto';

export function profilsHabilitationsFilterMapper(
    vo: ProfilsHabilitationsFilterEntity
): ProfilsHabilitationsFilterApiDto {
    const params: ProfilsHabilitationsFilterApiDto =
        {} as ProfilsHabilitationsFilterApiDto;

    if (vo.search) {
        params.search = vo.search;
    }
    if (vo.user) {
        params.user = vo.user;
    }
    if (vo.isActive !== undefined) {
        params.is_active = vo.isActive;
    }

    return params;
}
