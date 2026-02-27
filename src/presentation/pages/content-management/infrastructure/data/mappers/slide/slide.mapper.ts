import { inject, Injectable } from '@angular/core';

import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    SlideEntity,
    SlideProps,
} from '@presentation/pages/content-management/domain/entities/slide/slide.entity';
import { SlideItemApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class SlideMapper extends PaginatedMapper<SlideEntity, SlideItemApiDto> {
    private readonly actionDropdownMapper: ActionDropdownMapper =
        inject(ActionDropdownMapper);
    private readonly rolesMapper: RolesMapper = inject(RolesMapper);
    private readonly entityCache = new Map<string, SlideEntity>();

    protected mapItemFromDto(dto: SlideItemApiDto): SlideEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: SlideProps = {
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

        const entity = cached ? cached.with(props) : new SlideEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
