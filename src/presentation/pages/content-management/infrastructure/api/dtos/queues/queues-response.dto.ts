import { ReportSourceDto } from '@shared/data/dto/report-source.dto';
import { ReportTypeDto } from '@shared/data/dto/report-type.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';
import { TelecomOperatorDto } from '@shared/data/dto/telecom-operator.dto';

export interface QueuesItemDto {
    uniq_id: string;
    report_type: ReportTypeDto;
    operators: TelecomOperatorDto[];
    source: ReportSourceDto;
    initiator_phone_number: string;
    created_at: string;
}

export type QueuesResponseDto = PaginatedResponseDto<QueuesItemDto>;
