import { ProfilsHabilitationsUsersFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users-filter.entity';
import { ProfilsHabilitationsUsersFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-users-filter-api.dto';

export function profilsHabilitationsUsersFilterMapper(
    vo: ProfilsHabilitationsUsersFilterEntity
): ProfilsHabilitationsUsersFilterApiDto {
    const params: ProfilsHabilitationsUsersFilterApiDto =
        {} as ProfilsHabilitationsUsersFilterApiDto;

    if (vo.uniqId) {
        params.id = vo.uniqId;
    }

    if (vo.search) {
        params.search = vo.search;
    }
    if (vo.userEmail) {
        params.user_email = vo.userEmail;
    }
    if (vo.phone) {
        params.phone = vo.phone;
    }

    return params;
}
