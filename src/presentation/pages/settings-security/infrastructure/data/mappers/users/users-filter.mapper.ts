import { UsersFilterVo } from '@pages/settings-security/domain/value-objects/users/users-filter.vo';
import { UsersFilterApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-filter-api.dto';

export function usersFilterMapper(vo: UsersFilterVo): UsersFilterApiDto {
    const params: UsersFilterApiDto = {} as UsersFilterApiDto;

    if (vo.search) {
        params.search = vo.search;
    }
    if (vo.profile) {
        params.profile = vo.profile;
    }
    if (vo.role) {
        params.role = vo.role;
    }
    if (vo.isActive !== undefined) {
        params.is_active = !!vo.isActive;
    }

    return params;
}
