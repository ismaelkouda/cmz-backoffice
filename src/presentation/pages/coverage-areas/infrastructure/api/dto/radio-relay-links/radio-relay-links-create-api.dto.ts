export interface RadioRelayLinksCreateApiDto {
    name?: string;
    operator?: string;
    frequency?: string;
    first_point_lng?: string;
    first_point_lat?: string;
    second_point_lng?: string;
    second_point_lat?: string;
    geom_file?: File;
}
