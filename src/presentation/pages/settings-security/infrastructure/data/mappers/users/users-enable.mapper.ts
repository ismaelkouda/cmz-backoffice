import { UsersEnableEntity } from '@pages/settings-security/domain/entities/users/users-enable.entity';
import { UsersEnableApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-enable-api.dto';

export function usersEnableMapper(vo: UsersEnableEntity): UsersEnableApiDto {
    const prams = {} as UsersEnableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
