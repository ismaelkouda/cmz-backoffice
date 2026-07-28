export interface RadioRelayLinksItemApiDto {
    id: string;
    name: string;
    operator: string;
    frequency: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface RadioRelayLinksResponseApiDto {
    data: RadioRelayLinksItemApiDto[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}
