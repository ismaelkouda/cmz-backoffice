import { ApiStatus } from '@pages/report-states/infrastructure/enums/details/details-status-api.enum';
import { ActorDto } from '@shared/data/dto/actor.dto';
import { AdministrativeBoundaryDto } from '@shared/data/dto/administrative-boundary.dto';
import { LocationMethodDto } from '@shared/data/dto/location-method.dto';
import { LocationTypeDto } from '@shared/data/dto/location-type.dto';
import { ReportSourceDto } from '@shared/data/dto/report-source.dto';
import { ReportTypeDto } from '@shared/data/dto/report-type.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { TelecomOperatorDto } from '@shared/data/dto/telecom-operator.dto';

export type ReportStateDto =
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'in-progress'
    | 'completed'
    | 'terminated';

export type QualificationStateDto = 'completed';

export type ProcessingStateDto = 'pending' | 'in-progress';

export type FinalizationStateDto = 'pending' | 'in-progress';

export interface DetailsItemApiDto {
    uniq_id: string;
    request_report_uniq_id: string;
    source: ReportSourceDto;
    location_method: LocationMethodDto;
    location_type: LocationTypeDto;
    lat: string;
    long: string;
    what3words: string;
    place_description: string;
    location_name: string;
    report_type: ReportTypeDto;
    operators: TelecomOperatorDto[];
    place_photo: string;
    access_place_photo: string;
    description: string;
    initiator_phone_number: string;
    processed_at: string;
    approved_at: string | null;
    finalized_at: string | null;
    rejected_at: string | null;
    confirmed_at: string | null;
    abandoned_at: string | null;
    acknowledged_at: string | null;
    reason: string | null;
    callback_type: string | null;
    status: ApiStatus;
    qualification_state: QualificationStateDto | null;
    processing_state: ProcessingStateDto | null;
    finalization_state: FinalizationStateDto | null;
    state: ReportStateDto;
    deny_count: number;
    confirm_count: number;
    acknowledged_comment: string | null;
    processed_comment: string | null;
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
    municipality_code: number;
    initiator: ActorDto | null;
    acknowledged_by: ActorDto | null;
    approved_by: ActorDto | null;
    rejected_by: ActorDto | null;
    processed_by: ActorDto | null;
    confirmed_by: ActorDto | null;
    abandoned_by: ActorDto | null;
    region: AdministrativeBoundaryDto;
    department: AdministrativeBoundaryDto;
    municipality: AdministrativeBoundaryDto;
}

export type DetailsResponseApiDto = SimpleResponseDto<DetailsItemApiDto>;
