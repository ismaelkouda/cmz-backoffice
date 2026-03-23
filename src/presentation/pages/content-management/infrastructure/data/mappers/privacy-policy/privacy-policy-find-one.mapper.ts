import { inject, Injectable } from '@angular/core';
import { PrivacyPolicyFindOneEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';
import { PrivacyPolicyFindOneItemApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-find-one-response-api.dto';
import { StatusMapper } from '@pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-status.mapper';
import { PrivacyPolicyFindOneProps } from '@presentation/pages/content-management/domain/interfaces/privacy-policy/privacy-policy-find-one-props.interface';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyFindOneMapper extends SimpleResponseMapper<
    PrivacyPolicyFindOneEntity,
    PrivacyPolicyFindOneItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        PrivacyPolicyFindOneEntity
    >();
    private readonly statusMapper = inject(StatusMapper);

    protected mapItemFromDto(
        dto: PrivacyPolicyFindOneItemApiDto
    ): PrivacyPolicyFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: PrivacyPolicyFindOneProps = {
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
            : new PrivacyPolicyFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
