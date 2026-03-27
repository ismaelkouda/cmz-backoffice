import { inject, Injectable } from '@angular/core';
import { LegalNoticeFindOneEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';
import { LegalNoticeFindOneItemApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-find-one-response-api.dto';
import { StatusMapper } from '@pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice-status.mapper';
import { LegalNoticeFindOneProps } from '@pages/content-management/domain/interfaces/legal-notice/legal-notice-find-one-props.interface';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class LegalNoticeFindOneMapper extends SimpleResponseMapper<
    LegalNoticeFindOneEntity,
    LegalNoticeFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, LegalNoticeFindOneEntity>();
    private readonly statusMapper = inject(StatusMapper);

    protected mapItemFromDto(
        dto: LegalNoticeFindOneItemApiDto
    ): LegalNoticeFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: LegalNoticeFindOneProps = {
            uniqId: dto.id,
            version: dto.version,
            content: dto.content,
            status: this.statusMapper.mapFromDto(dto.is_published),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new LegalNoticeFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
