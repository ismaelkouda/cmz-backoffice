import { inject, Injectable } from '@angular/core';
import { SlideFindOneEntity } from '@pages/content-management/domain/entities/slide/slide-find-one.entity';
import { SlideFindOneProps } from '@pages/content-management/domain/interfaces/slide/slide-find-one-props.interface';
import { SlideFindOneItemApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-find-one-response-api.dto';
import { StatusMapper } from '@pages/content-management/infrastructure/data/mappers/slide/slide-status.mapper';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { PlatformMapper } from '@shared/data/mappers/platform.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class SlideFindOneMapper extends SimpleResponseMapper<
    SlideFindOneEntity,
    SlideFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, SlideFindOneEntity>();
    private readonly platformMapper = inject(PlatformMapper);
    private readonly statusMapper = inject(StatusMapper);
    private readonly utils = new MapperUtils();

    protected mapItemFromDto(dto: SlideFindOneItemApiDto): SlideFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: SlideFindOneProps = {
            uniqId: dto.id,
            type: dto.type,
            platforms: dto.platforms,
            title: dto.title,
            subtitle: dto.subtitle,
            content: dto.content,
            image: dto.image_url,
            video: dto.video_url,
            timeDuration: dto.time_duration_in_seconds,
            order: dto.order,
            buttonLabel: dto.button_label,
            buttonUrl: dto.button_url,
            status: this.statusMapper.mapFromDto(dto.is_active),
            startDate: dto.start_date ? new Date(dto.start_date) : new Date(),
            endDate: dto.end_date ? new Date(dto.end_date) : new Date(),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new SlideFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
