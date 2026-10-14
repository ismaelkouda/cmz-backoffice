import { ReportSourceDto } from '@shared/data/dto/report-source.dto';
import { ReportTypeDto } from '@shared/data/dto/report-type.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';
import { TelecomOperatorDto } from '@shared/data/dto/telecom-operator.dto';
import { ConformityDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-conformity-api.dto';

export enum ReportStateDto {
    TERMINATED = 'terminated',
}

export interface EvaluateItemApiDto {
    uniq_id: string;
    request_report_uniq_id: string;
    report_type: ReportTypeDto;
    operators: TelecomOperatorDto[];
    source: ReportSourceDto;
    initiator_phone_number: string;
    request_reports_count: number;
    reported_at: string;
    compliance_status: ConformityDto;
    updated_at: string;
}

export interface StatsDto {
    one_star: number;
    two_stars: number;
    three_stars: number;
    four_stars: number;
    five_stars: number;
}

export type EvaluateResponseApiDto = PaginatedResponseDto<
    EvaluateItemApiDto,
    StatsDto
>;
