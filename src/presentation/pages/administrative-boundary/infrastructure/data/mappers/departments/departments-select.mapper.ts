import { Injectable } from '@angular/core';
import { DepartmentsSelectEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-select.entity';
import { DepartmentsSelectItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { DepartmentsSelectProps } from '@shared/domain/interfaces/departments-select.props.interface';
import { MunicipalitiesSelectProps } from '@shared/domain/interfaces/municipalities-select.props.interface';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class DepartmentsSelectMapper extends ArrayResponseMapper<
    DepartmentsSelectEntity,
    DepartmentsSelectItemApiDto
> {
    private readonly entityCache = new Map<string, DepartmentsSelectEntity>();

    protected override mapItemFromDto(
        dto: DepartmentsSelectItemApiDto
    ): DepartmentsSelectEntity {
        MapperUtils.validateDto(dto, {
            required: ['id', 'name', 'code', 'municipalities'],
        });

        const cacheKey = `department:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const municipalities = dto.municipalities.map(
            (m): MunicipalitiesSelectProps => ({
                uniqId: m.id,
                name: m.name,
                value: JSON.stringify(m.id),
            })
        );

        const props: DepartmentsSelectProps = {
            uniqId: dto.id,
            value: JSON.stringify(dto.id),
            name: dto.name,
            municipalities: cached
                ? MapperUtils.mergeImmutable(
                      cached.municipalities,
                      municipalities,
                      (m) => m.uniqId,
                      (entity, dto) => dto,
                      (dto) => dto
                  )
                : municipalities,
        };

        const entity = cached
            ? cached.with(props)
            : new DepartmentsSelectEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
