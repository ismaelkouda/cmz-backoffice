import { Injectable } from '@angular/core';
import { TeamsSelectEntity } from '@pages/team-organization/domain/entities/teams/teams-select.entity';
import { TeamsSelectItemApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class TeamsSelectMapper extends ArrayResponseMapper<
    TeamsSelectEntity,
    TeamsSelectItemApiDto
> {
    private readonly entityCache = new Map<string, TeamsSelectEntity>();

    protected mapItemFromDto(dto: TeamsSelectItemApiDto): TeamsSelectEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : TeamsSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
