export class MapClustersQuery {
    constructor(
        public readonly minLat: string,
        public readonly maxLat: string,
        public readonly minLng: string,
        public readonly maxLng: string
    ) {}
}
