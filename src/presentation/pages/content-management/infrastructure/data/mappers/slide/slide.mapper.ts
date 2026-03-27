import { inject, Injectable } from '@angular/core';
import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import { SlideItemApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-response-api.dto';
import { StatusMapper } from '@pages/content-management/infrastructure/data/mappers/slide/slide-status.mapper';
import { SlideProps } from '@pages/content-management/domain/interfaces/slide/slide-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { PlatformMapper } from '@shared/data/mappers/platform.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class SlideMapper extends PaginatedMapper<SlideEntity, SlideItemApiDto> {
    private readonly entityCache = new Map<string, SlideEntity>();
    private readonly platformMapper = inject(PlatformMapper);
    private readonly statusMapper = inject(StatusMapper);
    private readonly utils = new MapperUtils();

    protected mapItemFromDto(dto: SlideItemApiDto): SlideEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: SlideProps = {
            uniqId: dto.id,
            type: dto.type,
            title: dto.title,
            subtitle: dto.subtitle,
            order: dto.order,
            platforms: this.utils.memoizedList(
                dto?.platforms,
                (p) => this.platformMapper.mapFromDto(p),
                (p) => `platforms${p}`
            ),
            status: this.statusMapper.mapFromDto(dto.is_active),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new SlideEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
