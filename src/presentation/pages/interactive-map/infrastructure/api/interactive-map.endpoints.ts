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
        'impacts/infrastructures/{reportUniqId}/tiles/{z}/{x}/{y}',
    /**
     * Statistiques d'infrastructures impactées par signalement, par tag
     * (education/sante/administration/securite/autre) — utilisé pour
     * afficher le nombre d'infrastructures impactées dans le panneau
     * "Filtres sur les couches" de management-map.
     */
    REPORT_INFRASTRUCTURE_STATS: 'impacts/infrastructures/{reportUniqId}/stats',
    MAP: 'variables',
} as const;
