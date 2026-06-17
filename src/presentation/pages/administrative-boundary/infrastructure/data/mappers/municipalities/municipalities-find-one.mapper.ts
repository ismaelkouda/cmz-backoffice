import { inject, Injectable } from '@angular/core';
import { MunicipalitiesFindOneEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';
import { MunicipalitiesFindOneItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-find-one-response-api.dto';
import { StatusMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-status.mapper';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
@Injectable({ providedIn: 'root' })
export class MunicipalitiesFindOneMapper extends SimpleResponseMapper<
    MunicipalitiesFindOneEntity,
    MunicipalitiesFindOneItemApiDto
> {
    private readonly statusMapper = inject(StatusMapper);
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

        const props = {
            uniqId: dto.id,
            name: dto.name,
            code: dto.code,
            description: dto.description,
            department: dto.department_code,
            region: dto.region_code,
            populationSize: dto.population_size,
            infrastructureSize: dto.infrastructure_size,
            status: this.statusMapper.mapApiToStatus(dto.is_active),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${props.uniqId}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new MunicipalitiesFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
