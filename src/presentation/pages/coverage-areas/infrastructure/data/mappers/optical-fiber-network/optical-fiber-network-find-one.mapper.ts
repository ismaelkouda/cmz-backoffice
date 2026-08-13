import { Injectable } from '@angular/core';
import { OpticalFiberNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network-find-one.entity';
import { OpticalFiberNetworkFindOneProps } from '@pages/coverage-areas/domain/interfaces/optical-fiber-network/optical-fiber-network-find-one-props.interface';
import { OpticalFiberNetworkFindOneItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';
import { FiberType } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-type.enum';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkFindOneMapper extends SimpleResponseMapper<
    OpticalFiberNetworkFindOneEntity,
    OpticalFiberNetworkFindOneItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        OpticalFiberNetworkFindOneEntity
    >();

    protected mapItemFromDto(
        dto: OpticalFiberNetworkFindOneItemApiDto
    ): OpticalFiberNetworkFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: OpticalFiberNetworkFindOneProps = {
            uniqId: dto.id,
            name: dto.name,
            operator: dto.operator as Operator,
            fiberConstructorId: String(dto.fiber_constructor_id ?? ''),
            longitudePointA: dto.longitude_point_a,
            latitudePointA: dto.latitude_point_a,
            longitudePointB: dto.longitude_point_b,
            latitudePointB: dto.latitude_point_b,
            fiberConstructorName: dto.fiber_constructor_name,
            type: dto.type as FiberType,
            geomUrl: dto.geom_url || dto.geom_file_url,
            geom: dto.geom,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new OpticalFiberNetworkFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
