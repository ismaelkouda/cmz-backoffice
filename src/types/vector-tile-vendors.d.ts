declare module 'pbf' {
    class Pbf {
        constructor(buffer?: ArrayBuffer | Uint8Array, readEnd?: number);
    }

    export default Pbf;
}

declare module '@mapbox/vector-tile' {
    import type Pbf from 'pbf';

    interface VectorTilePoint {
        x: number;
        y: number;
    }

    export class VectorTileFeature {
        readonly type: number;
        readonly properties: Record<string, unknown>;
        loadGeometry(): VectorTilePoint[][];
    }

    export class VectorTileLayer {
        readonly extent: number;
        readonly length: number;
        feature(i: number): VectorTileFeature;
    }

    export class VectorTile {
        constructor(pbf: Pbf);
        readonly layers: Record<string, VectorTileLayer>;
    }
}