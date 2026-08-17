import { Injectable } from '@angular/core';
import { SiteGroupFindOneEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-find-one.entity';
import { SiteGroupFindOneProps } from '@pages/coverage-areas/domain/interfaces/site-group/site-group-find-one-props.interface';
import { SiteGroupFindOneItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class SiteGroupFindOneMapper extends SimpleResponseMapper<
    SiteGroupFindOneEntity,
    SiteGroupFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, SiteGroupFindOneEntity>();

    protected mapItemFromDto(
        dto: SiteGroupFindOneItemApiDto
    ): SiteGroupFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: SiteGroupFindOneProps = {
            uniqId: dto.id,
            code: dto.code,
            name: dto.name,
            description: dto.description,
            color: dto.color,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new SiteGroupFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
