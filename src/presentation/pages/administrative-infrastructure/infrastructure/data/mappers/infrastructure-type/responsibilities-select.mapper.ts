import { Injectable } from '@angular/core';
import { ResponsibilitiesSelectEntity } from '@pages/settings-security/domain/entities/users/responsibilities-select.entity';
import { ResponsibilitiesSelectItemApiDto } from '@pages/settings-security/infrastructure/api/dto/users/responsibilities-select-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class ResponsibilitiesSelectMapper extends ArrayResponseMapper<
    ResponsibilitiesSelectEntity,
    ResponsibilitiesSelectItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        ResponsibilitiesSelectEntity
    >();

    protected mapItemFromDto(
        dto: ResponsibilitiesSelectItemApiDto
    ): ResponsibilitiesSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ResponsibilitiesSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
