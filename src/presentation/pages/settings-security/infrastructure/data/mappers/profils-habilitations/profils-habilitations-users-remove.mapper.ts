import { ProfilsHabilitationsUsersRemoveEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users-remove.entity';
import { ProfilsHabilitationsUsersRemoveApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-users-remove-api.dto';

export function profilsHabilitationsUsersRemoveMapper(
    vo: ProfilsHabilitationsUsersRemoveEntity
): ProfilsHabilitationsUsersRemoveApiDto {
    const params: ProfilsHabilitationsUsersRemoveApiDto =
        {} as ProfilsHabilitationsUsersRemoveApiDto;

    if (vo.uniqId) {
        params.profile_user_id = vo.uniqId;
    }

    if (vo.users) {
        params.users = vo.users;
    }

    return params;
}
