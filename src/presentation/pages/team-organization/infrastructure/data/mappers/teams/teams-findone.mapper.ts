import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

import { TeamsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-findone.entity';
import { TeamsFindOneItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-findone-response-api.dto';

@Injectable({ providedIn: 'root' })
export class TeamsFindOneMapper extends SimpleResponseMapper<
    TeamsFindOneEntity,
    TeamsFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, TeamsFindOneEntity>();

    protected mapItemFromDto(dto: TeamsFindOneItemApiDto): TeamsFindOneEntity {
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : TeamsFindOneEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
