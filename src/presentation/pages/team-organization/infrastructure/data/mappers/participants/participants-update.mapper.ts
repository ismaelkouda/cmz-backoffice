import { ParticipantsUpdateEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-update.entity';
import { ParticipantsUpdateApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-update-api.dto';

export function participantsUpdateMapper(
    entity: ParticipantsUpdateEntity
): ParticipantsUpdateApiDto {
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
        params.role = entity.role;
    }

    return params;
}
