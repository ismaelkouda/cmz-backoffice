import { inject, Injectable } from '@angular/core';
import {
    ParticipantsFindOneEntity,
    ParticipantsFindOneProps,
} from '@pages/team-organization/domain/entities/participants/participants-find-one.entity';
import { ParticipantsFindOneItemApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class ParticipantsFindOneMapper extends SimpleResponseMapper<
    ParticipantsFindOneEntity,
    ParticipantsFindOneItemApiDto
> {
    private readonly rolesMapper = inject(RolesMapper);
    private readonly entityCache = new Map<string, ParticipantsFindOneEntity>();

    protected mapItemFromDto(
        dto: ParticipantsFindOneItemApiDto
    ): ParticipantsFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const role = this.rolesMapper.mapFromDto(dto.role);
        const team = dto.team?.id ? `${dto.team?.name}` : null;

        const props: ParticipantsFindOneProps = {
            uniqId: dto.id,
            lastName: dto.last_name,
            firstName: dto.first_name,
            email: dto.email,
            phone: dto.phone,
            role,
            team,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new ParticipantsFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
