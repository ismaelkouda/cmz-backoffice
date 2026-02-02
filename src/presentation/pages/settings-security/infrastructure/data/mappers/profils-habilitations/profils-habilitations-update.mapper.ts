import { ProfilsHabilitationsUpdateEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-update.entity';
import { profilsHabilitationsUpdateApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-update-api.dto';

export function profilsHabilitationsUpdateMapper(
    entity: ProfilsHabilitationsUpdateEntity
): profilsHabilitationsUpdateApiDto {
    const params: profilsHabilitationsUpdateApiDto =
        {} as profilsHabilitationsUpdateApiDto;

    params['id'] = entity.uniqId;

    if (entity.name) {
        params['name'] = entity.name;
    }
    if (entity.description) {
        params['description'] = entity.description;
    }
    if (entity.permissions && entity.permissions.length > 0) {
        params['permissions'] = entity.permissions;
    }

    return params;
}
