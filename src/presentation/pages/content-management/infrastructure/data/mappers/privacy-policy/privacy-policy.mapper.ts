import { inject, Injectable } from '@angular/core';
import { PrivacyPolicyEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
import { PrivacyPolicyItemApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-response-api.dto';
import { StatusMapper } from '@pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-status.mapper';
import { PrivacyPolicyProps } from '@pages/content-management/domain/interfaces/privacy-policy/privacy-policy-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyMapper extends PaginatedMapper<
    PrivacyPolicyEntity,
    PrivacyPolicyItemApiDto
> {
    private readonly entityCache = new Map<string, PrivacyPolicyEntity>();
    private readonly statusMapper = inject(StatusMapper);
    private readonly utils = new MapperUtils();

    protected mapItemFromDto(
        dto: PrivacyPolicyItemApiDto
    ): PrivacyPolicyEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: PrivacyPolicyProps = {
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
            : new PrivacyPolicyEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
