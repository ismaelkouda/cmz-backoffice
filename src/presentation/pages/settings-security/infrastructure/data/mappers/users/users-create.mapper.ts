import { UsersCreateEntity } from '@pages/settings-security/domain/entities/users/users-create.entity';
import { UsersCreateApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-create-api.dto';

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
        params.profile_id = entity.profile;
    }
    if (entity.role) {
        params.role = entity.role;
    }

    return params;
}
