import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { ProfilesPermissionsUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-users.entity';
import { ProfilesPermissionsUsersItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-response-api.dto';

export class ProfilesPermissionsUsersMapper extends PaginatedMapper<
    ProfilesPermissionsUsersEntity,
    ProfilesPermissionsUsersItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        ProfilesPermissionsUsersEntity
    >();

    protected mapItemFromDto(
        dto: ProfilesPermissionsUsersItemApiDto
    ): ProfilesPermissionsUsersEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ProfilesPermissionsUsersEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
