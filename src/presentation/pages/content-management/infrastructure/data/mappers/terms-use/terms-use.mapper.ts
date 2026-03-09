import { inject, Injectable } from '@angular/core';

import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    TermsUseEntity,
    TermsUseProps,
} from '@presentation/pages/content-management/domain/entities/terms-use/terms-use.entity';
import { TermsUseItemApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class TermsUseMapper extends PaginatedMapper<
    TermsUseEntity,
    TermsUseItemApiDto
> {
    private readonly actionDropdownMapper: ActionDropdownMapper =
        inject(ActionDropdownMapper);
    private readonly rolesMapper: RolesMapper = inject(RolesMapper);
    private readonly entityCache = new Map<string, TermsUseEntity>();

    protected mapItemFromDto(dto: TermsUseItemApiDto): TermsUseEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: TermsUseProps = {
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

        const entity = cached ? cached.with(props) : new TermsUseEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
