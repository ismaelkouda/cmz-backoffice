import { UsersFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-filter.entity';
import { UsersFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/users/users-filter-api.dto';

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
    if (entity.responsibility) {
        params.responsibility = entity.responsibility;
    }
    if (entity.isActive !== undefined) {
        params.is_active = entity.isActive;
    }

    return params;
}
