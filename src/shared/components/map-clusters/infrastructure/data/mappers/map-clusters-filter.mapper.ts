import { MapClustersFilterEntity } from '@shared/components/map-clusters/domain/entities/map-clusters-filter.entity';
import { MapClustersFilterApiDto } from '@shared/components/map-clusters/infrastructure/api/dto/map-clusters-filter-api.dto';

export function mapClustersFilterMapper(
    vo: MapClustersFilterEntity
): MapClustersFilterApiDto {
    const params: MapClustersFilterApiDto = {} as MapClustersFilterApiDto;

    if (vo.minLat) {
        params.min_Lat = vo.minLat;
    }
    if (vo.maxLat) {
        params.max_Lat = vo.maxLat;
    }
    if (vo.minLng) {
        params.min_Lng = vo.minLng;
    }
    if (vo.maxLng) {
        params.max_Lng = vo.maxLng;
    }

    return params;
}
