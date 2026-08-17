import { MapClustersFilterDto } from '@shared/components/map-clusters/application/dto/map-clusters-filter.dto';

export class MapClustersFilterVo {
    public readonly minLat: string;
    public readonly maxLat: string;
    public readonly minLng: string;
    public readonly maxLng: string;

    private constructor(props: {
        minLat: string;
        maxLat: string;
        minLng: string;
        maxLng: string;
    }) {
        this.minLat = props.minLat;
        this.maxLat = props.maxLat;
        this.minLng = props.minLng;
        this.maxLng = props.maxLng;
    }

    static fromDto(dto: MapClustersFilterDto): MapClustersFilterVo {
        return new MapClustersFilterVo({
            minLat: dto.minLat?.trim(),
            maxLat: dto.maxLat?.trim(),
            minLng: dto.minLng?.trim(),
            maxLng: dto.maxLng?.trim(),
        });
    }
}
