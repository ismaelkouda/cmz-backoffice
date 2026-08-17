import { ProfilesPermissionsUsersEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users.entity';
import { ProfilesPermissionsUsersItemApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-response-api.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

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
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ProfilesPermissionsUsersEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
