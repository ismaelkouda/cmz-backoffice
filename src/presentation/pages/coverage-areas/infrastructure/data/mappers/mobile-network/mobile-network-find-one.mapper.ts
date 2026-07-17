import { Injectable } from '@angular/core';
import { MobileNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network-find-one.entity';
import { MobileNetworkFindOneProps } from '@pages/coverage-areas/domain/interfaces/mobile-network/mobile-network-find-one-props.interface';
import { MobileNetworkFindOneItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
import { Technology } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-technology.enum';
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
            towerTypeId: dto.tower_type_id,
            towerTypeName: dto.tower_type_name,
            towerSize: dto.tower_size,
            technology: dto.technology as Technology,
            operator: dto.operator as Operator,
            radius: dto.radius,
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
