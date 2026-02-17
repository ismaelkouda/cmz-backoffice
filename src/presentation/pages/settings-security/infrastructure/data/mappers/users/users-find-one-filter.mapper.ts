import { UsersFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-find-one-filter.entity';
import { UsersFindOneFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/users/users-findone-filter-api.dto';

export function usersFindOneFilterMapper(
    entity: UsersFindOneFilterEntity
): UsersFindOneFilterApiDto {
    const params: UsersFindOneFilterApiDto = {} as UsersFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}
