import { UsersEnableDto } from '@pages/settings-security/application/dto/users/users-enable.dto';
import { UsersEnableApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-enable-api.dto';

export function usersEnableMapper(dto: UsersEnableDto): UsersEnableApiDto {
    const prams = {} as UsersEnableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
