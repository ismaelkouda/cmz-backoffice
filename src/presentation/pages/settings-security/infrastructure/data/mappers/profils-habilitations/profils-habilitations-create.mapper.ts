import { ProfilsHabilitationsCreateEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-create.entity';
import { profilsHabilitationsCreateApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-create-api.dto';

export function profilsHabilitationsCreateMapper(
    vo: ProfilsHabilitationsCreateEntity
): profilsHabilitationsCreateApiDto {
    const params: profilsHabilitationsCreateApiDto =
        {} as profilsHabilitationsCreateApiDto;

    if (vo.name) {
        params['name'] = vo.name;
    }
    if (vo.description) {
        params['description'] = vo.description;
    }
    if (vo.permissions && vo.permissions.length > 0) {
        params['permissions'] = vo.permissions;
    }

    return params;
}
