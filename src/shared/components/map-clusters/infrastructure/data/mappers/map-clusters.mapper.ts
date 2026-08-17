import { Injectable } from '@angular/core';
import { MapClustersEntity } from '@shared/components/map-clusters/domain/entities/map-clusters.entity';
import { MapClustersProps } from '@shared/components/map-clusters/domain/interfaces/map-clusters-props.interface';
import { MapClustersItemApiDto } from '@shared/components/map-clusters/infrastructure/api/dto/map-clusters-response-api.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class MapClustersMapper extends PaginatedMapper<
    MapClustersEntity,
    MapClustersItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, MapClustersEntity>();

    protected override mapItemFromDto(
        dto: MapClustersItemApiDto
    ): MapClustersEntity {
        MapperUtils.validateDto(dto, {
            required: ['lat', 'long', 'count'],
        });

        const props: MapClustersProps = {
            lat: dto.lat,
            long: dto.long,
            count: parseInt(dto.count.toString(), 10),
        };

        const cacheKey = `dto:${dto.lat}${dto.long}${dto.count}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new MapClustersEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
