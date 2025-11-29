import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface DetailsItemDto {
    id: string;
    uniq_id: string;
    request_report_uniq_id: string;
    source: string;
    location_method: string;
    location_type: string;
    lat: string;
    long: string;
    what3words: string;
    place_description: string;
    location_name: string;
    report_type: string;
    operators: string[];
    cumulative_operators: string[];
    place_photo: string;
    access_place_photo: string;
    description: string;
    initiator_phone_number: string;
    approved_at: string | null;
    finalized_at: string | null;
    rejected_at: string | null;
    confirmed_at: string | null;
    abandoned_at: string | null;
    acknowledged_at: string | null;
    reason: string | null;
    status: string;
    state: string;
    confirm_count: number;
    deny_count: number;
    acknowledged_comment: string | null;
    approved_comment: string | null;
    rejected_comment: string | null;
    confirmed_comment: string | null;
    abandoned_comment: string | null;
    duplicate_of: string | null;
    is_duplicated: boolean;
    position: string;
    created_at: string;
    reported_at: string;
    updated_at: string;
    region_id: number;
    department_id: number;
    municipality_id: number;
    initiator: {
        last_name: string;
        first_name: string;
        phone: string;
    };
    acknowledged_by: {
        last_name: string;
        first_name: string;
        phone: string;
    };
    approved_by: {
        last_name: string;
        first_name: string;
        phone: string;
    };
    rejected_by: {
        last_name: string;
        first_name: string;
        phone: string;
    };
    confirmed_by: {
        last_name: string;
        first_name: string;
        phone: string;
    };
    abandoned_by: {
        last_name: string;
        first_name: string;
        phone: string;
    };
    region: string | null;
    department: string | null;
    municipality: string | null;
}

export interface DetailsResponseDto extends SimpleResponseDto<DetailsItemDto> {}
