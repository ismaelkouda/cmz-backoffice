export interface SiteGroupCoverageAreaProps {
    id: number;
    site_id: string;
    site_name: string;
    tower_height: string | number;
    network_technology: string[];
    operator: string;
    coverage_radius: number;
    lat: string | number;
    lng: string | number;
    is_active: boolean;
    updated_at: string;
}

export class SiteGroupCoverageAreaEntity {
    constructor(private readonly props: SiteGroupCoverageAreaProps) {}

    get id(): number {
        return this.props.id;
    }
    get site_id(): string {
        return this.props.site_id;
    }
    get site_name(): string {
        return this.props.site_name;
    }
    get tower_height(): string | number {
        return this.props.tower_height;
    }
    get network_technology(): string[] {
        return this.props.network_technology;
    }
    get operator(): string {
        return this.props.operator;
    }
    get coverage_radius(): number {
        return this.props.coverage_radius;
    }
    get lat(): string | number {
        return this.props.lat;
    }
    get lng(): string | number {
        return this.props.lng;
    }
    get is_active(): boolean {
        return this.props.is_active;
    }
    get updated_at(): string {
        return this.props.updated_at;
    }
}
