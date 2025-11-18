export interface DetailsItemDto {
    id: string;
    uniq_id: string;
    source: string;
    location_method: string;
    location_type: string;
    lat: string;
    long: string;
    what3words: string | null;
    place_description: string;
    location_name: string;
    report_type: string;
    operators: string[];
    cumulative_operators: string[];
    place_photo: string | null;
    access_place_photo: string | null;
    description: string;
    initiator_phone_number: string;
    approved_by: string | null;
    approved_at: string | null;
    rejected_by: string | null;
    rejected_at: string | null;
    confirmed_by: string | null;
    confirmed_at: string | null;
    abandoned_by: string | null;
    abandoned_at: string | null;
    reason: string | null;
    status: string;
    confirm_count: number;
    deny_count: number;
    approved_comment: string | null;
    rejected_comment: string | null;
    confirmed_comment: string | null;
    abandoned_comment: string | null;
    duplicate_of: string | null;
    is_duplicated: boolean;
    position: string;
    created_at: string;
    updated_at: string;
    region_id: number;
    department_id: number;
    municipality_id: number;
    initiator: {
        last_name: string;
        first_name: string;
        phone: string;
    };
    region: string | null;
    department: string | null;
    municipality: string | null;
}

export interface DetailsResponseDto {
    error: boolean;
    message: string;
    data: DetailsItemDto;
}
