import { Injectable } from '@angular/core';

import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MunicipalitiesSelectProps } from '@shared/domain/interfaces/municipalities-select.props.interface';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { MunicipalitiesSelectEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-select.entity';
import { MunicipalitiesSelectItemApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-select-response-api.dto';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesSelectMapper extends ArrayResponseMapper<
    MunicipalitiesSelectEntity,
    MunicipalitiesSelectItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        MunicipalitiesSelectEntity
    >();

    protected override mapItemFromDto(
        dto: MunicipalitiesSelectItemApiDto
    ): MunicipalitiesSelectEntity {
        MapperUtils.validateDto(dto, {
            required: ['id', 'name', 'code'],
        });

        const cacheKey = `municipality:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const props: MunicipalitiesSelectProps = {
            uniqId: dto.id,
            value: dto.id,
            name: dto.name,
        };

        const entity = cached
            ? cached.with(props)
            : new MunicipalitiesSelectEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
