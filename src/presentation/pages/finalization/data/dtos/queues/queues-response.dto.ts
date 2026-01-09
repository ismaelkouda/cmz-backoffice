import { ReportSourceDto } from '@shared/data/dtos/report-source.dto';
import { ReportTypeDto } from '@shared/data/dtos/report-type.dto';
import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';
import { TelecomOperatorDto } from '@shared/data/dtos/telecom-operator.dto';

export interface QueuesItemDto {
    uniq_id: string;
    report_type: ReportTypeDto;
    operators: Array<TelecomOperatorDto>;
    source: ReportSourceDto;
    initiator_phone_number: string;
    reported_at: string;
}

export interface QueuesResponseDto
    extends PaginatedResponseDto<QueuesItemDto> { }
