import { inject, Injectable } from '@angular/core';

import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    LegalNoticeEntity,
    LegalNoticeProps,
} from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import { LegalNoticeItemApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeMapper extends PaginatedMapper<
    LegalNoticeEntity,
    LegalNoticeItemApiDto
> {
    private readonly actionDropdownMapper: ActionDropdownMapper =
        inject(ActionDropdownMapper);
    private readonly rolesMapper: RolesMapper = inject(RolesMapper);
    private readonly entityCache = new Map<string, LegalNoticeEntity>();

    protected mapItemFromDto(dto: LegalNoticeItemApiDto): LegalNoticeEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: LegalNoticeProps = {
            uniqId: dto.id,
            lastName: dto.last_name,
            firstName: dto.first_name,
            email: dto.email,
            phone: dto.phone,
            role: this.rolesMapper.mapFromDto(dto.role),
            roleStyle: this.rolesMapper.mapFromStyle(dto.role),
            status: this.actionDropdownMapper.mapFromDto(dto.status),
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
