import { ApiFinalizationState } from '@pages/finalization/infrastructure/enums/details/details-finalization-state-api.enum';
import { ApiState } from '@pages/finalization/infrastructure/enums/details/details-state-api.enum';
import { ActorDto } from '@shared/data/dto/actor.dto';
import { AdministrativeBoundaryDto } from '@shared/data/dto/administrative-boundary.dto';
import { LocationMethodDto } from '@shared/data/dto/location-method.dto';
import { LocationTypeDto } from '@shared/data/dto/location-type.dto';
import { ReportSourceDto } from '@shared/data/dto/report-source.dto';
import { ReportTypeDto } from '@shared/data/dto/report-type.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { TelecomOperatorDto } from '@shared/data/dto/telecom-operator.dto';

export type ReportStatusDto = 'finalization';

export type ReportStateDto = 'pending' | 'in-progress' | 'completed';

export type FinalizationStateDto = 'pending' | 'in-progress';

export interface DetailsItemApiDto {
    id: string;
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
    status: ReportStatusDto;
    finalization_state: ApiFinalizationState;
    state: ApiState;
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
