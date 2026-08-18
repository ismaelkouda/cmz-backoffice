export interface MobileNetworkFilterApiDto {
    search?: string;
    site_group_id?: string;
    tower_type_id?: string;
    tower_size?: number;
    technology?: string;
    operator?: string;
    radius?: number;
    start_date?: Date;
    end_date?: Date;
}
