import { Injectable } from '@angular/core';

import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { ProfilesPermissionsEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions.entity';
import { ProfilesPermissionsItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsMapper extends PaginatedMapper<
    ProfilesPermissionsEntity,
    ProfilesPermissionsItemApiDto
> {
    private readonly entityCache = new Map<string, ProfilesPermissionsEntity>();

    protected mapItemFromDto(
        dto: ProfilesPermissionsItemApiDto
    ): ProfilesPermissionsEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ProfilesPermissionsEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
