import { Paginate } from '@shared/data/dtos/simple-response.dto';

export interface TreatmentItemDto {
    id: string;
    uniq_id: string;
    initiated_by: string;
    source: string;
    location_method: string;
    location_type: string;
    lat: string | null;
    long: string | null;
    what3words: string | null;
    place_description: string | null;
    location_name: string | null;
    report_type: string;
    operators: string | string[] | null;
    place_photo: string | null;
    access_place_photo: string | null;
    description: string | null;
    submission_state: string | null;
    processing_state: string | null;
    closure_state: string | null;
    status: string;
    state: string;
    vote_confirm_count: number;
    vote_deny_count: number;
    approved_comment: string | null;
    processed_comment: string | null;
    closed_comment: string | null;
    evaluation_avg_rating: string;
    duplicate_of: string | null;
    duplicate_count: number;
    is_duplicated: boolean;
    created_at: string;
    updated_at: string;
}

export interface TreatmentResponseDto {
    error: boolean;
    message: string;
    data: Paginate<TreatmentItemDto>;
}
