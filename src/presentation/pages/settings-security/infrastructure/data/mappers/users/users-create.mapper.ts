import { UsersCreateEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-create.entity';
import { UsersCreateApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/users/users-create-api.dto';

export function usersCreateMapper(
    entity: UsersCreateEntity
): UsersCreateApiDto {
    const params: UsersCreateApiDto = {} as UsersCreateApiDto;

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
