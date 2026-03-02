import { Injectable } from '@angular/core';

import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { NewsCategoriesSelectEntity } from '@presentation/pages/content-management/domain/entities/news/news-categories-select.entity';
import { NewsCategoriesSelectItemApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/news/news-categories-select-response-api.dto';

@Injectable({ providedIn: 'root' })
export class NewsCategoriesSelectMapper extends ArrayResponseMapper<
    NewsCategoriesSelectEntity,
    NewsCategoriesSelectItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        NewsCategoriesSelectEntity
    >();

    protected override mapItemFromDto(
        dto: NewsCategoriesSelectItemApiDto
    ): NewsCategoriesSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : NewsCategoriesSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
