import { inject, Injectable } from '@angular/core';

import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    NewsEntity,
    NewsProps,
} from '@presentation/pages/content-management/domain/entities/news/news.entity';
import { NewsItemApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/news/news-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class NewsMapper extends PaginatedMapper<NewsEntity, NewsItemApiDto> {
    private readonly actionDropdownMapper: ActionDropdownMapper =
        inject(ActionDropdownMapper);
    private readonly rolesMapper: RolesMapper = inject(RolesMapper);
    private readonly entityCache = new Map<string, NewsEntity>();

    protected mapItemFromDto(dto: NewsItemApiDto): NewsEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: NewsProps = {
            uniqId: dto.id,
            lastName: dto.last_name,
            firstName: dto.first_name,
            email: dto.email,
            phone: dto.phone,
            role: this.rolesMapper.mapFromDto(dto.role),
            status: this.actionDropdownMapper.mapFromDto(dto.status),
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new NewsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
