import { UsersUpdateEntity } from '@pages/settings-security/domain/entities/users/users-update.entity';
import { UsersUpdateApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-update-api.dto';

export function usersUpdateMapper(
    entity: UsersUpdateEntity
): UsersUpdateApiDto {
    const params: UsersUpdateApiDto = {} as UsersUpdateApiDto;

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
        params.phone = entity.phone;
    }
    if (entity.profile) {
        params.profile = entity.profile;
    }
    if (entity.responsibility) {
        params.responsibility = entity.responsibility;
    }

    return params;
}
