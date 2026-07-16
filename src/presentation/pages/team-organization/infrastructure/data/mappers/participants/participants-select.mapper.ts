import { Injectable } from '@angular/core';
import { ParticipantsSelectEntity } from '@pages/team-organization/domain/entities/participants/participants-select.entity';
import { ParticipantsSelectItemApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class ParticipantsSelectMapper extends ArrayResponseMapper<
    ParticipantsSelectEntity,
    ParticipantsSelectItemApiDto
> {
    private readonly entityCache = new Map<string, ParticipantsSelectEntity>();

    protected mapItemFromDto(
        dto: ParticipantsSelectItemApiDto
    ): ParticipantsSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ParticipantsSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
