export const enum EndPointUrl {
    GET_ALL_ZONE_TRAFIC = 'analyse-alerte/zone-de-trafic/all?page={page}',
    GET_ALL_DEPARTEMENT = 'analyse-alerte/departements/all',
    GET_ALL_COMMUNE = 'analyse-alerte/communes/all',
    GET_TRAFIC_GEOJSON = 'analyse-alerte/zone-de-trafic/{id}/get_zone_trafic_geojson',
    GET_TRACKING_GEOJSON = 'analyse-alerte/zone-de-trafic/{id}/maj-zone-trafic'
}