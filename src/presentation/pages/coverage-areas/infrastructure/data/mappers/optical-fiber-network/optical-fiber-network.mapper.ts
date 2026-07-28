import { Injectable } from '@angular/core';
import { OpticalFiberNetworkEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network.entity';
import { OpticalFiberNetworkItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-response-api.dto';
import { OpticalFiberNetworkProps } from '@pages/coverage-areas/domain/interfaces/optical-fiber-network/optical-fiber-network-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
import { Status } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-status.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';
import { FiberType } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-type.enum';

@Injectable({
    providedIn: 'root',
})
export class OpticalFiberNetworkMapper extends PaginatedMapper<
    OpticalFiberNetworkEntity,
    OpticalFiberNetworkItemApiDto
> {
    private readonly entityCache = new Map<string, OpticalFiberNetworkEntity>();

    protected mapItemFromDto(
        dto: OpticalFiberNetworkItemApiDto
    ): OpticalFiberNetworkEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: OpticalFiberNetworkProps = {
            uniqId: dto.id,
            name: dto.name,
            operator: dto.operator as Operator,
            fiberConstructorId: String(dto.fiber_constructor_id ?? ''),
            fiberConstructorName: dto.fiber_constructor_name,
            type: dto.type as FiberType,
            status: dto.is_active ? Status.ACTIVE : Status.INACTIVE,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new OpticalFiberNetworkEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
