import { inject, Injectable } from '@angular/core';
import { NewsEntity } from '@pages/content-management/domain/entities/news/news.entity';
import { NewsItemApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-response-api.dto';
import { StatusMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-status.mapper';
import { NewsProps } from '@presentation/pages/content-management/domain/interfaces/news/news-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class NewsMapper extends PaginatedMapper<NewsEntity, NewsItemApiDto> {
    private readonly entityCache = new Map<string, NewsEntity>();
    private readonly statusMapper = inject(StatusMapper);
    private readonly utils = new MapperUtils();

    protected mapItemFromDto(dto: NewsItemApiDto): NewsEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: NewsProps = {
            uniqId: dto.id,
            type: dto.type,
            title: dto.title,
            status: this.statusMapper.mapFromDto(dto.is_published),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new NewsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
