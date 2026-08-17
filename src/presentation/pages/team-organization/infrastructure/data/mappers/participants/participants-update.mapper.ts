import { inject, Injectable } from '@angular/core';
import { ParticipantsUpdateValidateContract } from '@pages/team-organization/domain/contracts/participants/participants-update.validate-contract';
import { ParticipantsUpdateApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-update-api.dto';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';

@Injectable({ providedIn: 'root' })
export class ParticipantsUpdateMapper {
    private readonly rolesMapper = inject(RolesMapper);
    mapEntityToApi(
        props: ParticipantsUpdateValidateContract
    ): ParticipantsUpdateApiDto {
        const params: ParticipantsUpdateApiDto = {} as ParticipantsUpdateApiDto;

        if (props.uniqId) {
            params.id = props.uniqId;
        }
        if (props.firstName) {
            params.first_name = props.firstName;
        }
        if (props.lastName) {
            params.last_name = props.lastName;
        }
        if (props.email) {
            params.email = props.email;
        }
        if (props.phone) {
            params.phone_number = props.phone;
        }
        if (props.role) {
            params.role = this.rolesMapper.mapToDto(props.role);
        }
        if (props.team) {
            params.team_uniq_id = props.team;
        }
        return params;
    }
}
