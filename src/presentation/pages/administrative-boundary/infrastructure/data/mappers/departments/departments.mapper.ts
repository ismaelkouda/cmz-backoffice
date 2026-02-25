import { Injectable } from '@angular/core';

import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { DepartmentsEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments.entity';
import { DepartmentsItemApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/departments/departments-response-api.dto';

@Injectable({ providedIn: 'root' })
export class DepartmentsMapper extends PaginatedMapper<
    DepartmentsEntity,
    DepartmentsItemApiDto
> {
    private readonly entityCache = new Map<string, DepartmentsEntity>();

    protected override mapItemFromDto(
        dto: DepartmentsItemApiDto
    ): DepartmentsEntity {
        MapperUtils.validateDto(dto, {
            required: ['id'],
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : DepartmentsEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
