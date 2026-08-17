import { MapClustersFilterVo } from '@shared/components/map-clusters/domain/value-objects/map-clusters-filter.vo';

export class MapClustersFilterEntity {
    constructor(
        public readonly minLat?: string,
        public readonly maxLat?: string,
        public readonly minLng?: string,
        public readonly maxLng?: string
    ) {}

    static fromVo(vo: MapClustersFilterVo): MapClustersFilterEntity {
        return new MapClustersFilterEntity(
            vo.minLat,
            vo.maxLat,
            vo.minLng,
            vo.maxLng
        );
    }
}
