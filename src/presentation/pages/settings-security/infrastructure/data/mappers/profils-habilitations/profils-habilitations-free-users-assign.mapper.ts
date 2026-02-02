import { ProfilsHabilitationsFreeUsersAssignEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-free-users-assign.entity';
import { ProfilsHabilitationsFreeUsersAssignApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-free-users-assign-api.dto';

export function profilsHabilitationsFreeUsersAssignMapper(
    vo: ProfilsHabilitationsFreeUsersAssignEntity
): ProfilsHabilitationsFreeUsersAssignApiDto {
    const params: ProfilsHabilitationsFreeUsersAssignApiDto =
        {} as ProfilsHabilitationsFreeUsersAssignApiDto;

    if (vo.uniqId) {
        params.profile_user_id = vo.uniqId;
    }

    if (vo.users) {
        params.users = vo.users;
    }

    return params;
}
