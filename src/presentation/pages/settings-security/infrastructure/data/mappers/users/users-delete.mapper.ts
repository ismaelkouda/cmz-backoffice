import { UsersDeleteEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-delete.entity';
import { UsersDeleteApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/users/users-delete-api.dto';

export function usersDeleteMapper(vo: UsersDeleteEntity): UsersDeleteApiDto {
    const prams = {} as UsersDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
