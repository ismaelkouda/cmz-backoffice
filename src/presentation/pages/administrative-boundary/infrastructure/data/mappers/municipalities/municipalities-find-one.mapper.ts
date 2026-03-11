import { Injectable } from '@angular/core';
import { MunicipalitiesFindOneEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';
import { MunicipalitiesFindOneItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
@Injectable({ providedIn: 'root' })
export class MunicipalitiesFindOneMapper extends SimpleResponseMapper<
    MunicipalitiesFindOneEntity,
    MunicipalitiesFindOneItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        MunicipalitiesFindOneEntity
    >();

    protected override mapItemFromDto(
        dto: MunicipalitiesFindOneItemApiDto
    ): MunicipalitiesFindOneEntity {
        MapperUtils.validateDto(dto, {
            required: ['id'],
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : MunicipalitiesFindOneEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
