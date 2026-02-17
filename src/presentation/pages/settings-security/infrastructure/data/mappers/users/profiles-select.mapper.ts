import { Injectable } from '@angular/core';

import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { ProfilesSelectEntity } from '@presentation/pages/settings-security/core/domain/entities/users/profiles-select.entity';
import { ProfilesSelectItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/users/profiles-select-api.dto';

@Injectable({ providedIn: 'root' })
export class ProfilesSelectMapper extends ArrayResponseMapper<
    ProfilesSelectEntity,
    ProfilesSelectItemApiDto
> {
    private readonly entityCache = new Map<string, ProfilesSelectEntity>();

    protected mapItemFromDto(
        dto: ProfilesSelectItemApiDto
    ): ProfilesSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ProfilesSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
