import { UsersFindOneFilterApiDto } from 'presentation/pages/settings-security/infrastructure/api/dtos/users/users-findone-filter-api.dto';

import { UsersFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-findone-filter.entity';

export function usersFindOneFilterMapper(
    entity: UsersFindOneFilterEntity
): UsersFindOneFilterApiDto {
    const params: UsersFindOneFilterApiDto = {} as UsersFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}
