import { UsersDisableEntity } from '@pages/settings-security/domain/entities/users/users-disable.entity';
import { UsersDisableApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-disable-api.dto';

export function usersDisableMapper(vo: UsersDisableEntity): UsersDisableApiDto {
    const prams = {} as UsersDisableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
