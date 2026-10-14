import { ReportSourceDto } from '@shared/data/dto/report-source.dto';
import { ReportTypeDto } from '@shared/data/dto/report-type.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';
import { TelecomOperatorDto } from '@shared/data/dto/telecom-operator.dto';

export enum ReportStateDto {
    TERMINATED = 'terminated',
}

export interface ApproveItemApiDto {
    uniq_id: string;
    report_uniq_id: string;
    report_type: ReportTypeDto;
    operators: TelecomOperatorDto[];
    source: ReportSourceDto;
    initiator_phone_number: string;
    evaluations_count: number;
    reported_at: string;
    updated_at: string;
}

export interface StatsDto {
    total: number;
    zob: { count: number; rate: number };
    cps: { count: number; rate: number };
    abi: { count: number; rate: number };
    cpo: { count: number; rate: number };
}
export type ApproveResponseApiDto = PaginatedResponseDto<
    ApproveItemApiDto,
    StatsDto
>;
