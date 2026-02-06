import { Injectable } from '@angular/core';

import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

import { ProfilsHabilitationsEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations.entity';
import { ProfilsHabilitationsItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class ProfilsHabilitationsMapper extends PaginatedMapper<
    ProfilsHabilitationsEntity,
    ProfilsHabilitationsItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        ProfilsHabilitationsEntity
    >();

    protected mapItemFromDto(
        dto: ProfilsHabilitationsItemApiDto
    ): ProfilsHabilitationsEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ProfilsHabilitationsEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
