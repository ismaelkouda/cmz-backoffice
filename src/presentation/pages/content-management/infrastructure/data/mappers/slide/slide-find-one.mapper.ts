import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    SlideFindOneEntity,
    SlideFindOneProps,
} from '@presentation/pages/content-management/domain/entities/slide/slide-find-one.entity';
import { SlideFindOneItemApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-find-one-response-api.dto';

@Injectable({ providedIn: 'root' })
export class SlideFindOneMapper extends SimpleResponseMapper<
    SlideFindOneEntity,
    SlideFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, SlideFindOneEntity>();

    protected mapItemFromDto(dto: SlideFindOneItemApiDto): SlideFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: SlideFindOneProps = {
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
            : new SlideFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
