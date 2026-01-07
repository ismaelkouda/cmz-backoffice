import { ReportSourceDto } from '@shared/data/dtos/report-source.dto';
import { ReportTypeDto } from '@shared/data/dtos/report-type.dto';
import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';
import { TelecomOperatorDto } from '@shared/data/dtos/telecom-operator.dto';

export enum ReportStateDto {
    COMPLETED = 'completed',
}

export interface AllItemDto {
    uniq_id: string;
    report_type: ReportTypeDto;
    operators: Array<TelecomOperatorDto>;
    source: ReportSourceDto;
    initiator_phone_number: string;
    state: ReportStateDto;
    created_at: string;
}

export interface AllResponseDto extends PaginatedResponseDto<AllItemDto> {}
