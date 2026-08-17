import { inject, Injectable } from '@angular/core';
import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { ProfilesPermissionsItemApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-response-api.dto';
import { StatusMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-status.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsMapper extends PaginatedMapper<
    ProfilesPermissionsEntity,
    ProfilesPermissionsItemApiDto
> {
    private readonly statusMapper = inject(StatusMapper);
    private readonly entityCache = new Map<string, ProfilesPermissionsEntity>();

    protected mapItemFromDto(
        dto: ProfilesPermissionsItemApiDto
    ): ProfilesPermissionsEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });

        const props = {
            uniqId: dto.uniq_id,
            name: dto.name,
            slug: dto.slug,
            description: dto.description,
            usersCount: dto.users_count,
            status: this.statusMapper.mapApiToStatus(dto.is_active),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${props.uniqId}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new ProfilesPermissionsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
