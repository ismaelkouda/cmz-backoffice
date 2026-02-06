import { Injectable } from '@angular/core';

import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

import { RolesSelectEntity } from '@presentation/pages/team-organization/domain/entities/participants/roles-select.entity';
import { RolesSelectItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/roles-select-api.dto';

@Injectable({ providedIn: 'root' })
export class RolesSelectMapper extends ArrayResponseMapper<
    RolesSelectEntity,
    RolesSelectItemApiDto
> {
    private readonly entityCache = new Map<string, RolesSelectEntity>();

    protected mapItemFromDto(dto: RolesSelectItemApiDto): RolesSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : RolesSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
