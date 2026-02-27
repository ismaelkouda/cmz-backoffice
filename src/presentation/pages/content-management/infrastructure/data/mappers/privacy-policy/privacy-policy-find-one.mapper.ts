import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    PrivacyPolicyFindOneEntity,
    PrivacyPolicyFindOneProps,
} from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';
import { PrivacyPolicyFindOneItemApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-find-one-response-api.dto';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyFindOneMapper extends SimpleResponseMapper<
    PrivacyPolicyFindOneEntity,
    PrivacyPolicyFindOneItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        PrivacyPolicyFindOneEntity
    >();

    protected mapItemFromDto(
        dto: PrivacyPolicyFindOneItemApiDto
    ): PrivacyPolicyFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: PrivacyPolicyFindOneProps = {
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
            : new PrivacyPolicyFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
