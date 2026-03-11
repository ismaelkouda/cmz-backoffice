import { inject, Injectable } from '@angular/core';
import { HomeEntity } from '@pages/content-management/domain/entities/home/home.entity';
import { HomeProps } from '@pages/content-management/domain/interfaces/home/home-props.interface';
import { HomeItemApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-response-api.dto';
import { StatusMapper } from '@pages/content-management/infrastructure/data/mappers/home/home-status.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { PlatformMapper } from '@shared/data/mappers/platform.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class HomeMapper extends PaginatedMapper<HomeEntity, HomeItemApiDto> {
    private readonly entityCache = new Map<string, HomeEntity>();
    private readonly platformMapper = inject(PlatformMapper);
    private readonly statusMapper = inject(StatusMapper);
    private readonly utils = new MapperUtils();

    protected mapItemFromDto(dto: HomeItemApiDto): HomeEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: HomeProps = {
            uniqId: dto.id,
            platforms: this.utils.memoizedList(
                dto?.platforms,
                (p) => this.platformMapper.mapFromDto(p),
                (p) => `platforms${p}`
            ),
            title: dto.title,
            resume: dto.resume,
            image: dto.image_url,
            order: dto.order,
            status: this.statusMapper.mapFromDto(dto.is_active),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new HomeEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
