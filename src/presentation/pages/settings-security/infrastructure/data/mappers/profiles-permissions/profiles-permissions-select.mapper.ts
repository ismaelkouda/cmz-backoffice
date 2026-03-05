import { Injectable } from '@angular/core';

import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { ProfilesPermissionsSelectEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-select.entity';
import { ProfilesPermissionsSelectItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-select-api.dto';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsSelectMapper extends ArrayResponseMapper<
    ProfilesPermissionsSelectEntity,
    ProfilesPermissionsSelectItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        ProfilesPermissionsSelectEntity
    >();

    protected mapItemFromDto(
        dto: ProfilesPermissionsSelectItemApiDto
    ): ProfilesPermissionsSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ProfilesPermissionsSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
