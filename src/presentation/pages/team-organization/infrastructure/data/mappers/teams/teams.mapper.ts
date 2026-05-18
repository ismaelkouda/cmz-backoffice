import { Injectable, inject } from '@angular/core';
import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import { TeamsItemApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-response-api.dto';
import { StatusMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-status.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class TeamsMapper extends PaginatedMapper<TeamsEntity, TeamsItemApiDto> {
    private readonly statusMapper = inject(StatusMapper);
    private readonly entityCache = new Map<string, TeamsEntity>();

    protected mapItemFromDto(dto: TeamsItemApiDto): TeamsEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });

        const props = {
            uniqId: dto.uniq_id,
            code: dto.code,
            name: dto.name,
            description: dto.description,
            status: this.statusMapper.mapApiToStatus(dto.is_active),
            membersCount: dto.members_count,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${props.uniqId}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new TeamsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
