import { Injectable } from '@angular/core';

import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { DepartmentsSelectProps } from '@shared/domain/interfaces/departments-select.props.interface';
import { MunicipalitiesSelectProps } from '@shared/domain/interfaces/municipalities-select.props.interface';
import { RegionsSelectProps } from '@shared/domain/interfaces/regions-select.props.interface';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { RegionsSelectEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-select.entity';
import { RegionsSelectItemApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/regions/regions-select-response-api.dto';

@Injectable({ providedIn: 'root' })
export class RegionsSelectMapper extends ArrayResponseMapper<
    RegionsSelectEntity,
    RegionsSelectItemApiDto
> {
    private readonly entityCache = new Map<string, RegionsSelectEntity>();

    protected override mapItemFromDto(
        dto: RegionsSelectItemApiDto
    ): RegionsSelectEntity {
        MapperUtils.validateDto(dto, {
            required: ['id', 'name', 'code', 'departments'],
        });

        const cacheKey = `region:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const departments = dto.departments.map(
            (d): DepartmentsSelectProps => ({
                uniqId: d.id,
                name: d.name,
                value: d.id,
                municipalities: d.municipalities.map(
                    (m): MunicipalitiesSelectProps => ({
                        uniqId: m.id,
                        name: m.name,
                        value: m.id,
                    })
                ),
            })
        );

        const props: RegionsSelectProps = {
            uniqId: dto.id,
            name: dto.name,
            value: dto.id,
            departments: cached
                ? MapperUtils.mergeImmutable(
                      cached.departments,
                      departments,
                      (d) => d.uniqId,
                      (entity, dto) => ({
                          ...entity,
                          ...dto,
                      }),
                      (dto) => dto
                  )
                : departments,
        };

        const entity = cached
            ? cached.with(props)
            : new RegionsSelectEntity(props);

        this.entityCache.set(cacheKey, entity);

        return entity;
    }
}
