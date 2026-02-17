import { Injectable, inject } from '@angular/core';

import { ActionDropdownDto } from '@shared/data/dto/action-dropdown.dto';
import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    TeamsEntity,
    TeamsProps,
} from '@presentation/pages/team-organization/domain/entities/teams/teams.entity';
import { TeamsItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class TeamsMapper extends PaginatedMapper<TeamsEntity, TeamsItemApiDto> {
    private readonly actionDropdownMapper: ActionDropdownMapper =
        inject(ActionDropdownMapper);
    private readonly entityCache = new Map<string, TeamsEntity>();

    protected mapItemFromDto(dto: TeamsItemApiDto): TeamsEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const mappedActionDropdown = this.actionDropdownMapper.mapFromDto(
            this.mapActionDropdown(dto.is_active)
        );

        const props: TeamsProps = {
            uniqId: dto.uniq_id,
            code: dto.code,
            name: dto.name,
            description: dto.description,
            status: mappedActionDropdown,
            membersCount: dto.members_count,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${props.uniqId}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new TeamsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }

    private mapActionDropdown(dto: boolean): ActionDropdownDto {
        if (dto) {
            return ActionDropdownDto.ACTIVE;
        }
        return ActionDropdownDto.INACTIVE;
    }
}
