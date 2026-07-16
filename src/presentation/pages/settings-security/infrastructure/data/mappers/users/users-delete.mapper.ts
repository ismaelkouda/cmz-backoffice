import { UsersDeleteDto } from '@pages/settings-security/application/dto/users/users-delete.dto';
import { UsersDeleteApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-delete-api.dto';

export function usersDeleteMapper(dto: UsersDeleteDto): UsersDeleteApiDto {
    const prams = {} as UsersDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
