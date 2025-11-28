import { ReportStatus } from '@presentation/pages/report-requests/domain/entities/all/all.entity';
import { Paginate } from '@shared/data/dtos/simple-response.dto';

export interface AllItemDto {
    id: string;
    uniq_id: string;
    source: string;
    location_method: string;
    location_type: string;
    lat: string;
    long: string;
    what3words: string;
    place_description: string;
    location_name: string;
    report_type: string;
    operators: string;
    cumulative_operators: string;
    place_photo: string | null;
    access_place_photo: string | null;
    description: string;
    initiator_phone_number: string;
    approved_by: string | null;
    approved_at: string | null;
    rejected_by: string | null;
    rejected_at: string | null;
    status: ReportStatus;
    confirm_count: number;
    deny_count: number;
    approved_comment: string | null;
    duplicate_of: string | null;
    is_duplicated: boolean;
    position: string;
    created_at: string;
    updated_at: string;
}

export interface AllResponseDto {
    error: boolean;
    message: string;
    data: Paginate<AllItemDto>;
}
