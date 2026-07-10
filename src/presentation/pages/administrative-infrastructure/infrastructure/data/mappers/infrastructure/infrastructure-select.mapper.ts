import { Injectable } from '@angular/core';
import { InfrastructureSelectEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-select.entity';
import { InfrastructureSelectItemApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-select-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class InfrastructureSelectMapper extends ArrayResponseMapper<
    InfrastructureSelectEntity,
    InfrastructureSelectItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        InfrastructureSelectEntity
    >();

    protected mapItemFromDto(
        dto: InfrastructureSelectItemApiDto
    ): InfrastructureSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : InfrastructureSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
