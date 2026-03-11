import { inject, Injectable } from '@angular/core';
import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { ParticipantsProps } from '@pages/team-organization/domain/interfaces/participants/participants-props.entity';
import { ParticipantsItemApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-response-api.dto';
import { StatusMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-status.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsMapper extends PaginatedMapper<
    ParticipantsEntity,
    ParticipantsItemApiDto
> {
    private readonly rolesMapper: RolesMapper = inject(RolesMapper);
    private readonly entityCache = new Map<string, ParticipantsEntity>();
    private readonly statusMapper = inject(StatusMapper);

    protected mapItemFromDto(dto: ParticipantsItemApiDto): ParticipantsEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: ParticipantsProps = {
            uniqId: dto.id,
            lastName: dto.last_name,
            firstName: dto.first_name,
            email: dto.email,
            phone: dto.phone,
            role: this.rolesMapper.mapFromDto(dto.role),
            status: this.statusMapper.mapFromDto(dto.status),
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new ParticipantsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
