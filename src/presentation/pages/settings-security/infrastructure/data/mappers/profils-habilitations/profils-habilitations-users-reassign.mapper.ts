import { ProfilsHabilitationsUsersReassignEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users-reassign.entity';
import { ProfilsHabilitationsUsersReassignApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-users-reassign-api.dto';

export function profilsHabilitationsUsersReassignMapper(
    vo: ProfilsHabilitationsUsersReassignEntity
): ProfilsHabilitationsUsersReassignApiDto {
    const params: ProfilsHabilitationsUsersReassignApiDto =
        {} as ProfilsHabilitationsUsersReassignApiDto;

    if (vo.uniqId) {
        params.profile_user_id = vo.uniqId;
    }

    if (vo.users) {
        params.users = vo.users;
    }

    return params;
}
