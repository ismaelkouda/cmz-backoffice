import { ProfilsHabilitationsFilterDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-filter.dto';
import { ProfilsHabilitationsFilterControl } from '@presentation/pages/settings-security/core/domain/controls/profils-habilitations/profils-habilitations-filter.control';

export function toFilterDto(
    control: ProfilsHabilitationsFilterControl
): ProfilsHabilitationsFilterDto {
    return {
        search: control.search.value,
        user: control.user.value,
        isActive: control.isActive.value,
    };
}
