import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

import { ParticipantsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-findone.entity';
import { ParticipantsFindOneItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-findone-response-api.dto';

@Injectable({ providedIn: 'root' })
export class ParticipantsFindonMapper extends SimpleResponseMapper<
    ParticipantsFindOneEntity,
    ParticipantsFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, ParticipantsFindOneEntity>();

    protected mapItemFromDto(
        dto: ParticipantsFindOneItemApiDto
    ): ParticipantsFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ParticipantsFindOneEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
