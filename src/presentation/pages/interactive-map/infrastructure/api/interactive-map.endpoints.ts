export const INTERACTIVE_MAP_ENDPOINTS = {
    MAP_CLUSTERS: 'map/clusters',
    REPORTS: 'all',
    COVERAGE_AREAS_GEOJSON: 'coverage-areas/geojson',
    COVERAGE_AREAS_TILES: 'coverage-areas/tiles/{z}/{x}/{y}',
    /** Tiles d'équipements (base-settings) — placeholders OpenLayers {z}/{x}/{y} */
    INFRASTRUCTURES_TILES: 'infrastructures/tiles/{z}/{x}/{y}',
    /**
     * Tiles d'équipements/infrastructures scopées à un signalement
     * (management-map) — placeholders {reportUniqId} et {z}/{x}/{y}.
     */
    REPORT_INFRASTRUCTURE_TILES:
        'infrastructure/{reportUniqId}/tiles/{z}/{x}/{y}',
    MAP: 'variables',
} as const;
