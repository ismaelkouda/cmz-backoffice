import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { DepartmentsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';
import { DepartmentsFindOneItemApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/departments/departments-find-one-response-api.dto';

@Injectable({ providedIn: 'root' })
export class DepartmentsFindOneMapper extends SimpleResponseMapper<
    DepartmentsFindOneEntity,
    DepartmentsFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, DepartmentsFindOneEntity>();

    protected override mapItemFromDto(
        dto: DepartmentsFindOneItemApiDto
    ): DepartmentsFindOneEntity {
        MapperUtils.validateDto(dto, {
            required: ['id'],
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : DepartmentsFindOneEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
