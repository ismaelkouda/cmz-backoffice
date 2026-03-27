import { inject, Injectable } from '@angular/core';
import { TermsUseEntity } from '@pages/content-management/domain/entities/terms-use/terms-use.entity';
import { TermsUseItemApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-response-api.dto';
import { StatusMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-status.mapper';
import { TermsUseProps } from '@pages/content-management/domain/interfaces/terms-use/terms-use-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class TermsUseMapper extends PaginatedMapper<
    TermsUseEntity,
    TermsUseItemApiDto
> {
    private readonly entityCache = new Map<string, TermsUseEntity>();
    private readonly statusMapper = inject(StatusMapper);
    private readonly utils = new MapperUtils();

    protected mapItemFromDto(dto: TermsUseItemApiDto): TermsUseEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: TermsUseProps = {
            uniqId: dto.id,
            version: dto.version,
            status: this.statusMapper.mapFromDto(dto.is_published),
            createdAt: dto.created_at,
            publishedAt: dto.published_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new TermsUseEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
