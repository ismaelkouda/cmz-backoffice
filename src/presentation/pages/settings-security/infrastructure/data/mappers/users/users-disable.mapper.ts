import { UsersDisableDto } from '@pages/settings-security/application/dto/users/users-disable.dto';
import { UsersDisableApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-disable-api.dto';

export function usersDisableMapper(dto: UsersDisableDto): UsersDisableApiDto {
    const prams = {} as UsersDisableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
