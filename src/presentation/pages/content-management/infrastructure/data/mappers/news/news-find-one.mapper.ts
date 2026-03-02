import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    NewsFindOneEntity,
    NewsFindOneProps,
} from '@presentation/pages/content-management/domain/entities/news/news-find-one.entity';
import { NewsFindOneItemApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/news/news-find-one-response-api.dto';

@Injectable({ providedIn: 'root' })
export class NewsFindOneMapper extends SimpleResponseMapper<
    NewsFindOneEntity,
    NewsFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, NewsFindOneEntity>();

    protected mapItemFromDto(dto: NewsFindOneItemApiDto): NewsFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: NewsFindOneProps = {
            uniqId: dto.id,
            lastName: dto.last_name,
            firstName: dto.first_name,
            email: dto.email,
            phone: dto.phone,
            role: dto.role,
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
