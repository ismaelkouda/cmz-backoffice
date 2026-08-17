export interface MobileNetworkUpdateApiDto {
    id: string;
    site_id: string;
    site_name: string;
    site_group_id: string | number;
    tower_type_id: string | number;
    tower_height: string;
    network_technology: string;
    operator: string;
    coverage_radius?: number;
}
