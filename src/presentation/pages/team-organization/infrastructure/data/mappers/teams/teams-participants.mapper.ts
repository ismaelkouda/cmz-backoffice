import { inject, Injectable } from '@angular/core';
import { TeamsParticipantsEntity } from '@pages/team-organization/domain/entities/teams/teams-participants.entity';
import { TeamsParticipantsItemApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-response-api.dto';
import { TeamsParticipantsProps } from '@presentation/pages/team-organization/domain/interfaces/teams/teams-participants-props.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class TeamsParticipantsMapper extends PaginatedMapper<
    TeamsParticipantsEntity,
    TeamsParticipantsItemApiDto
> {
    private readonly rolesMapper: RolesMapper = inject(RolesMapper);
    private readonly entityCache = new Map<string, TeamsParticipantsEntity>();

    protected mapItemFromDto(
        dto: TeamsParticipantsItemApiDto
    ): TeamsParticipantsEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: TeamsParticipantsProps = {
            uniqId: dto.id,
            lastName: dto.last_name,
            firstName: dto.first_name,
            email: dto.email,
            phone: dto.phone,
            role: this.rolesMapper.mapFromDto(dto.role),
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new TeamsParticipantsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
