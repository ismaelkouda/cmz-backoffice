import { Injectable } from '@angular/core';
import { ProfilesPermissionsSelectEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-select.entity';
import { ProfilesPermissionsSelectItemApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-select-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

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
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ProfilesPermissionsSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
