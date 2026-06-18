import { inject, Injectable } from '@angular/core';
import { ParticipantsUpdateEntity } from '@pages/team-organization/domain/entities/participants/participants-update.entity';
import { ParticipantsUpdateApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-update-api.dto';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';

@Injectable({ providedIn: 'root' })
export class ParticipantsUpdateMapper {
    private readonly rolesMapper = inject(RolesMapper);
    mapEntityToApi(entity: ParticipantsUpdateEntity): ParticipantsUpdateApiDto {
        const params: ParticipantsUpdateApiDto = {} as ParticipantsUpdateApiDto;

        if (entity.uniqId) {
            params.id = entity.uniqId;
        }
        if (entity.firstName) {
            params.first_name = entity.firstName;
        }
        if (entity.lastName) {
            params.last_name = entity.lastName;
        }
        if (entity.email) {
            params.email = entity.email;
        }
        if (entity.phone) {
            params.phone_number = entity.phone;
        }
        if (entity.role) {
            params.role = this.rolesMapper.mapToDto(entity.role);
        }
        if (entity.team) {
            params.team_id = entity.team;
        }
        return params;
    }
}
