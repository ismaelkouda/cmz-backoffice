import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    HomeFindOneEntity,
    HomeFindOneProps,
} from '@presentation/pages/content-management/domain/entities/home/home-find-one.entity';
import { HomeFindOneItemApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-find-one-response-api.dto';

@Injectable({ providedIn: 'root' })
export class HomeFindOneMapper extends SimpleResponseMapper<
    HomeFindOneEntity,
    HomeFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, HomeFindOneEntity>();

    protected mapItemFromDto(dto: HomeFindOneItemApiDto): HomeFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: HomeFindOneProps = {
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
            : new HomeFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
