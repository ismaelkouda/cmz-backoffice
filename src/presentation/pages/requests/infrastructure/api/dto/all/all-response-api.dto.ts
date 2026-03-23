import { ApiStatus } from '@pages/requests/infrastructure/enums/all/all-status-api.enum';
import { ReportSourceDto } from '@shared/data/dto/report-source.dto';
import { ReportTypeDto } from '@shared/data/dto/report-type.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';
import { TelecomOperatorDto } from '@shared/data/dto/telecom-operator.dto';

export interface AllItemApiDto {
    uniq_id: string;
    report_type: ReportTypeDto;
    operators: TelecomOperatorDto[];
    source: ReportSourceDto;
    initiator_phone_number: string;
    status: ApiStatus;
    reported_at: string;
    updated_at: string;
}

export type AllResponseApiDto = PaginatedResponseDto<AllItemApiDto>;
