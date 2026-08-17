import { inject, Injectable } from '@angular/core';
import { NewsFindOneEntity } from '@pages/content-management/domain/entities/news/news-find-one.entity';
import { NewsFindOneProps } from '@pages/content-management/domain/interfaces/news/news-find-one-props.interface';
import { NewsFindOneItemApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-find-one-response-api.dto';
import { StatusMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-status.mapper';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class NewsFindOneMapper extends SimpleResponseMapper<
    NewsFindOneEntity,
    NewsFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, NewsFindOneEntity>();
    private readonly statusMapper = inject(StatusMapper);

    protected mapItemFromDto(dto: NewsFindOneItemApiDto): NewsFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: NewsFindOneProps = {
            uniqId: dto.id,
            type: dto.type,
            hashtags: dto.hashtags,
            title: dto.title,
            resume: dto.resume,
            content: dto.content,
            image: dto.image_url,
            video: dto.video_url,
            order: dto.order,
            category: JSON.stringify(dto.category.id),
            subCategory: JSON.stringify(dto.sub_category?.id),
            status: this.statusMapper.mapFromDto(dto.is_published),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new NewsFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
