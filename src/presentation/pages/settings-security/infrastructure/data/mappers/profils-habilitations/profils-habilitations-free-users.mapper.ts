import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

import { ProfilsHabilitationsFreeUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-free-users.entity';
import { ProfilsHabilitationsFreeUsersItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-free-users-response-api.dto';

export class ProfilsHabilitationsFreeUsersMapper extends PaginatedMapper<
    ProfilsHabilitationsFreeUsersEntity,
    ProfilsHabilitationsFreeUsersItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        ProfilsHabilitationsFreeUsersEntity
    >();

    protected mapItemFromDto(
        dto: ProfilsHabilitationsFreeUsersItemApiDto
    ): ProfilsHabilitationsFreeUsersEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ProfilsHabilitationsFreeUsersEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
