import { inject, Injectable } from '@angular/core';
import { LegalNoticeEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import { LegalNoticeItemApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-response-api.dto';
import { StatusMapper } from '@pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice-status.mapper';
import { LegalNoticeProps } from '@presentation/pages/content-management/domain/interfaces/legal-notice/legal-notice-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeMapper extends PaginatedMapper<
    LegalNoticeEntity,
    LegalNoticeItemApiDto
> {
    private readonly entityCache = new Map<string, LegalNoticeEntity>();
    private readonly statusMapper = inject(StatusMapper);
    private readonly utils = new MapperUtils();

    protected mapItemFromDto(dto: LegalNoticeItemApiDto): LegalNoticeEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: LegalNoticeProps = {
            uniqId: dto.id,
            version: dto.version,
            status: this.statusMapper.mapFromDto(dto.is_published),
            createdAt: dto.created_at,
            publishedAt: dto.published_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new LegalNoticeEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
