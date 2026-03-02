import { Injectable } from '@angular/core';

import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { DepartmentsSelectEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-select.entity';
import { DepartmentsSelectItemApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/departments/departments-select-response-api.dto';

@Injectable({ providedIn: 'root' })
export class DepartmentsSelectMapper extends ArrayResponseMapper<
    DepartmentsSelectEntity,
    DepartmentsSelectItemApiDto
> {
    private readonly entityCache = new Map<string, DepartmentsSelectEntity>();

    protected override mapItemFromDto(
        dto: DepartmentsSelectItemApiDto
    ): DepartmentsSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : DepartmentsSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
