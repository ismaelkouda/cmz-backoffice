import { Injectable } from '@angular/core';
import { RolesSelectEntity } from '@pages/team-organization/domain/entities/participants/roles-select.entity';
import { RolesSelectItemApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/roles-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

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
