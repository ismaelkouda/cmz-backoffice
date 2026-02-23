import { ProfilesPermissionsFilterDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-filter.dto';
import { ProfilesPermissionsFilterControl } from '@presentation/pages/settings-security/domain/controls/profiles-permissions/profiles-permissions-filter.control';

export function toFilterDto(
    control: ProfilesPermissionsFilterControl
): ProfilesPermissionsFilterDto {
    return {
        search: control.search.value,
        user: control.user.value,
        isActive: control.isActive.value,
    };
}
