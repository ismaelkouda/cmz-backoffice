import { Injectable } from '@angular/core';
import { MobileNetworkEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network.entity';
import { MobileNetworkItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-response-api.dto';
import { MobileNetworkProps } from '@pages/coverage-areas/domain/interfaces/mobile-network/mobile-network-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
import { Status } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-status.enum';
import { Technology } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-technology.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

@Injectable({
    providedIn: 'root',
})
export class MobileNetworkMapper extends PaginatedMapper<
    MobileNetworkEntity,
    MobileNetworkItemApiDto
> {
    private readonly entityCache = new Map<string, MobileNetworkEntity>();

    protected mapItemFromDto(
        dto: MobileNetworkItemApiDto
    ): MobileNetworkEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: MobileNetworkProps = {
            uniqId: dto.id,
            siteId: dto.site_id,
            siteName: dto.site_name,
            towerTypeId: dto.tower_type_id,
            towerTypeName: dto.tower_type_name,
            towerSize: dto.tower_size,
            technology: (Array.isArray(dto.technology)
                ? dto.technology
                : dto.technology
                  ? [dto.technology]
                  : []) as Technology[],
            operator: dto.operator as Operator,
            radius: dto.radius,
            status: dto.is_active ? Status.ACTIVE : Status.INACTIVE,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new MobileNetworkEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
