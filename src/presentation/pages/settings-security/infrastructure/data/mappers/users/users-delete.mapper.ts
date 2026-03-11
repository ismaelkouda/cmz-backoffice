import { UsersDeleteEntity } from '@pages/settings-security/domain/entities/users/users-delete.entity';
import { UsersDeleteApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-delete-api.dto';

export function usersDeleteMapper(vo: UsersDeleteEntity): UsersDeleteApiDto {
    const prams = {} as UsersDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
