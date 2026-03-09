import { inject, Injectable } from '@angular/core';

import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    PrivacyPolicyEntity,
    PrivacyPolicyProps,
} from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
import { PrivacyPolicyItemApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyMapper extends PaginatedMapper<
    PrivacyPolicyEntity,
    PrivacyPolicyItemApiDto
> {
    private readonly actionDropdownMapper: ActionDropdownMapper =
        inject(ActionDropdownMapper);
    private readonly rolesMapper: RolesMapper = inject(RolesMapper);
    private readonly entityCache = new Map<string, PrivacyPolicyEntity>();

    protected mapItemFromDto(
        dto: PrivacyPolicyItemApiDto
    ): PrivacyPolicyEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: PrivacyPolicyProps = {
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

        const entity = cached
            ? cached.with(props)
            : new PrivacyPolicyEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
