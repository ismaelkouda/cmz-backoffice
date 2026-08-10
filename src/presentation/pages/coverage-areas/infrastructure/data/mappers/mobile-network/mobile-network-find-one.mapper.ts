import { Injectable } from '@angular/core';
import { MobileNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network-find-one.entity';
import { MobileNetworkFindOneProps } from '@pages/coverage-areas/domain/interfaces/mobile-network/mobile-network-find-one-props.interface';
import { MobileNetworkFindOneItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

@Injectable({ providedIn: 'root' })
export class MobileNetworkFindOneMapper extends SimpleResponseMapper<
    MobileNetworkFindOneEntity,
    MobileNetworkFindOneItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        MobileNetworkFindOneEntity
    >();

    protected mapItemFromDto(
        dto: MobileNetworkFindOneItemApiDto
    ): MobileNetworkFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: MobileNetworkFindOneProps = {
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
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new MobileNetworkFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
