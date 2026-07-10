import { Injectable } from '@angular/core';
import { InfrastructureTypeSelectEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-select.entity';
import { InfrastructureTypeSelectItemApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-select-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeSelectMapper extends ArrayResponseMapper<
    InfrastructureTypeSelectEntity,
    InfrastructureTypeSelectItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        InfrastructureTypeSelectEntity
    >();

    protected mapItemFromDto(
        dto: InfrastructureTypeSelectItemApiDto
    ): InfrastructureTypeSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : InfrastructureTypeSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
