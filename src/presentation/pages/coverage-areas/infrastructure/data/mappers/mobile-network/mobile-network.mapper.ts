import { Injectable } from '@angular/core';
import { MobileNetworkEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network.entity';
import { MobileNetworkItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-response-api.dto';
import { MobileNetworkProps } from '@pages/coverage-areas/domain/interfaces/mobile-network/mobile-network-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
import { Status } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-status.enum';
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
            siteGroupId: dto.site_group.id,
            siteGroupName: dto.site_group.name,
            towerTypeId: dto.tower_type.id,
            towerTypeName: dto.tower_type.name,
            towerHeight: dto.tower_height,
            networkTechnology: dto.network_technology,
            operator: dto.operator as Operator,
            coverageRadius: dto.coverage_radius,
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
