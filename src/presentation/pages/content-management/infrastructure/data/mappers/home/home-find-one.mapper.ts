import { inject, Injectable } from '@angular/core';
import { HomeFindOneEntity } from '@pages/content-management/domain/entities/home/home-find-one.entity';
import { HomeFindOneProps } from '@pages/content-management/domain/interfaces/home/home-find-one-props.interface';
import { HomeFindOneItemApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-find-one-response-api.dto';
import { StatusMapper } from '@pages/content-management/infrastructure/data/mappers/home/home-status.mapper';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class HomeFindOneMapper extends SimpleResponseMapper<
    HomeFindOneEntity,
    HomeFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, HomeFindOneEntity>();
    private readonly statusMapper = inject(StatusMapper);

    protected mapItemFromDto(dto: HomeFindOneItemApiDto): HomeFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: HomeFindOneProps = {
            uniqId: dto.id,
            platforms: dto.platforms,
            title: dto.title,
            resume: dto.resume,
            content: dto.content,
            image: dto.image_url,
            timeDurationInSeconds: dto.time_duration_in_seconds,
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
            : new HomeFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
