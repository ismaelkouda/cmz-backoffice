import { MapClustersProps } from '@shared/components/map-clusters/domain/interfaces/map-clusters-props.interface';

export class MapClustersEntity implements MapClustersProps {
    constructor(private readonly props: MapClustersProps) {}

    get lat(): string {
        return this.props.lat;
    }

    get long(): string {
        return this.props.long;
    }

    get count(): number {
        return this.props.count;
    }

    public with(props: MapClustersProps): MapClustersEntity {
        if (this.lat === props.lat && this.long === props.long) {
            return this;
        }
        return new MapClustersEntity(props);
    }
}
