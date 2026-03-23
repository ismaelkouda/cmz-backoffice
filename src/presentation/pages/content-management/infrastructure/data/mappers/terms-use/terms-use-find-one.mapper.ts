import { inject, Injectable } from '@angular/core';
import { TermsUseFindOneEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';
import { TermsUseFindOneItemApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-find-one-response-api.dto';
import { StatusMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-status.mapper';
import { TermsUseFindOneProps } from '@presentation/pages/content-management/domain/interfaces/terms-use/terms-use-find-one-props.interface';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class TermsUseFindOneMapper extends SimpleResponseMapper<
    TermsUseFindOneEntity,
    TermsUseFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, TermsUseFindOneEntity>();
    private readonly statusMapper = inject(StatusMapper);

    protected mapItemFromDto(
        dto: TermsUseFindOneItemApiDto
    ): TermsUseFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: TermsUseFindOneProps = {
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
            : new TermsUseFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
