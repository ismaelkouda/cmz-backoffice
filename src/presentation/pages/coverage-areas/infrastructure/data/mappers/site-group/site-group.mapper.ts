import { Injectable } from '@angular/core';
import { SiteGroupEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group.entity';
import { SiteGroupItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-response-api.dto';
import { SiteGroupProps } from '@pages/coverage-areas/domain/interfaces/site-group/site-group-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
import { Status } from '@pages/coverage-areas/domain/enums/site-group/site-group-status.enum';

@Injectable({
    providedIn: 'root',
})
export class SiteGroupMapper extends PaginatedMapper<
    SiteGroupEntity,
    SiteGroupItemApiDto
> {
    private readonly entityCache = new Map<string, SiteGroupEntity>();

    protected mapItemFromDto(dto: SiteGroupItemApiDto): SiteGroupEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: SiteGroupProps = {
            uniqId: dto.id,
            code: dto.code,
            name: dto.name,
            description: dto.description,
            status: dto.is_active ? Status.ACTIVE : Status.INACTIVE,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new SiteGroupEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
