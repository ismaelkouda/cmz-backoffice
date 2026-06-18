import { inject, Injectable } from '@angular/core';
import { ParticipantsCreateEntity } from '@pages/team-organization/domain/entities/participants/participants-create.entity';
import { ParticipantsCreateApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-create-api.dto';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';

@Injectable({ providedIn: 'root' })
export class ParticipantsCreateMapper {
    private readonly rolesMapper = inject(RolesMapper);
    mapEntityToApi(entity: ParticipantsCreateEntity): ParticipantsCreateApiDto {
        const params: ParticipantsCreateApiDto = {} as ParticipantsCreateApiDto;

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
