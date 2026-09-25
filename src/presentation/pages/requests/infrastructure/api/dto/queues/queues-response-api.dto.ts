import { ReportSourceDto } from '@shared/data/dto/report-source.dto';
import { ReportTypeDto } from '@shared/data/dto/report-type.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';
import { TelecomOperatorDto } from '@shared/data/dto/telecom-operator.dto';

export enum ReportStateDto {
    TERMINATED = 'terminated',
}

export interface QueuesItemApiDto {
    uniq_id: string;
    report_type: ReportTypeDto;
    operators: TelecomOperatorDto[];
    source: ReportSourceDto;
    initiator_phone_number: string;
    reported_at: string;
    updated_at: string;
}

export interface StatsDto {
    total: number;
    app: { count: number; rate: number };
    sms: { count: number; rate: number };
    ussd: { count: number; rate: number };
    ivr: { count: number; rate: number };
    api_client: { count: number; rate: number };
}

export type QueuesResponseApiDto = PaginatedResponseDto<
    QueuesItemApiDto,
    StatsDto
>;
