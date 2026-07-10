import { Injectable } from '@angular/core';
import {
    InfrastructureFindOneEntity,
    InfrastructureFindOneProps,
} from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one.entity';
import { InfrastructureFindOneItemApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class InfrastructureFindOneMapper extends SimpleResponseMapper<
    InfrastructureFindOneEntity,
    InfrastructureFindOneItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        InfrastructureFindOneEntity
    >();

    protected mapItemFromDto(
        dto: InfrastructureFindOneItemApiDto
    ): InfrastructureFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: InfrastructureFindOneProps = {
            uniqId: dto.id,
            name: dto.name,
            type: dto.type,
            description: dto.description,
            region: dto.region.name,
            department: dto.department.name,
            municipality: dto.municipality.name,
            position: {
                latitude: this.parseCoordinate(dto.lat),
                longitude: this.parseCoordinate(dto.long),
            },
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new InfrastructureFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }

    private parseCoordinate(coord: string): number {
        const parsed = Number.parseFloat(coord);
        return Number.isNaN(parsed) ? 0 : parsed;
    }
}
