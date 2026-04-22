import { UsersFilterEntity } from '@pages/settings-security/domain/entities/users/users-filter.entity';
import { UsersFilterApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-filter-api.dto';

export function usersFilterMapper(
    entity: UsersFilterEntity
): UsersFilterApiDto {
    const params: UsersFilterApiDto = {} as UsersFilterApiDto;

    if (entity.search) {
        params.search = entity.search;
    }
    if (entity.profile) {
        params.profile = entity.profile;
    }
    if (entity.role) {
        params.role = entity.role;
    }
    if (entity.isActive !== undefined) {
        params.is_active = !!entity.isActive;
    }

    return params;
}
