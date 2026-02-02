import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

import { ProfilsHabilitationsUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users.entity';
import { ProfilsHabilitationsUsersItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-users-response-api.dto';

export class ProfilsHabilitationsUsersMapper extends PaginatedMapper<
    ProfilsHabilitationsUsersEntity,
    ProfilsHabilitationsUsersItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        ProfilsHabilitationsUsersEntity
    >();

    protected mapItemFromDto(
        dto: ProfilsHabilitationsUsersItemApiDto
    ): ProfilsHabilitationsUsersEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ProfilsHabilitationsUsersEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
