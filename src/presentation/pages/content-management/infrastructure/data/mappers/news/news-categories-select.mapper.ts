import { Injectable } from '@angular/core';
import { NewsCategoriesSelectEntity } from '@pages/content-management/domain/entities/news/news-categories-select.entity';
import { NewsCategoriesSelectProps } from '@pages/content-management/domain/interfaces/news/news-categories-select.props.interface';
import { NewsSubCategoriesSelectProps } from '@pages/content-management/domain/interfaces/news/news-sub-categories-select.props.interface';
import { NewsCategoriesSelectItemApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-categories-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

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
        MapperUtils.validateDto(dto, {
            required: ['id', 'name'],
        });

        const cacheKey = `categories:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const sub_categories = (dto.sub_categories ?? []).map(
            (m): NewsSubCategoriesSelectProps => ({
                uniqId: m.id,
                name: m.name,
                value: JSON.stringify(m.id),
            })
        );

        const props: NewsCategoriesSelectProps = {
            uniqId: dto.id,
            value: JSON.stringify(dto.id),
            name: dto.name,
            subCategories: cached
                ? MapperUtils.mergeImmutable(
                      cached.subCategories,
                      sub_categories,
                      (m) => m.uniqId,
                      (entity, dto) => dto,
                      (dto) => dto
                  )
                : sub_categories,
        };

        const entity = cached
            ? cached.with(props)
            : new NewsCategoriesSelectEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
