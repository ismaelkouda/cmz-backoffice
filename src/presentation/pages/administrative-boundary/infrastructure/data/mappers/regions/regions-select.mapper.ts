import { Injectable } from '@angular/core';
import { RegionsSelectEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-select.entity';
import { RegionsSelectItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { DepartmentsSelectProps } from '@shared/domain/interfaces/departments-select.props.interface';
import { MunicipalitiesSelectProps } from '@shared/domain/interfaces/municipalities-select.props.interface';
import { RegionsSelectProps } from '@shared/domain/interfaces/regions-select.props.interface';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

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
                value: JSON.stringify(dto.id),
                municipalities: d.municipalities.map(
                    (m): MunicipalitiesSelectProps => ({
                        uniqId: m.id,
                        name: m.name,
                        value: JSON.stringify(m.id),
                    })
                ),
            })
        );

        const props: RegionsSelectProps = {
            uniqId: dto.id,
            name: dto.name,
            value: JSON.stringify(dto.id),
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
