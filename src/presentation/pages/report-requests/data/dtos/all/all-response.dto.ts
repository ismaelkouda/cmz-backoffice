import { ReportSourceDto } from '@shared/data/dtos/report-source.dto';
import { ReportTypeDto } from '@shared/data/dtos/report-type.dto';
import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';
import { TelecomOperatorDto } from '@shared/data/dtos/telecom-operator.dto';

export enum ReportStatusDto {
    CONFIRMED = 'confirmed',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    ABANDONED = 'abandoned',
    UNKNOWN = 'unknown',
}

export interface AllItemDto {
    uniq_id: string;
    report_type: ReportTypeDto;
    operators: Array<TelecomOperatorDto>;
    source: ReportSourceDto;
    initiator_phone_number: string;
    status: ReportStatusDto;
    reported_at: string;
}

export interface AllResponseDto extends PaginatedResponseDto<AllItemDto> { }
