export interface RadioRelayLinksUpdateApiDto {
    id?: string;
    name?: string;
    operator?: string;
    frequency?: string;
    longitude_point_a?: string;
    latitude_point_a?: string;
    longitude_point_b?: string;
    latitude_point_b?: string;
    geom_file?: File;
}
