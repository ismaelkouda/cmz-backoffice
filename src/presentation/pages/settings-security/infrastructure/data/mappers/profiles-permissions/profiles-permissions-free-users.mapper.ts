import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { ProfilesPermissionsFreeUsersEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-free-users.entity';
import { ProfilesPermissionsFreeUsersItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-free-users-response-api.dto';

export class ProfilesPermissionsFreeUsersMapper extends PaginatedMapper<
    ProfilesPermissionsFreeUsersEntity,
    ProfilesPermissionsFreeUsersItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        ProfilesPermissionsFreeUsersEntity
    >();

    protected mapItemFromDto(
        dto: ProfilesPermissionsFreeUsersItemApiDto
    ): ProfilesPermissionsFreeUsersEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ProfilesPermissionsFreeUsersEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
