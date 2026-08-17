import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface DashboardItemApiDto {
    readonly uniq_id: string;
    readonly total_reports: number;
    readonly total_cpo_reports?: number;
    readonly pendingReports?: number;
    readonly approvedReports?: number;
    readonly rejectedReports?: number;
    readonly inTreatmentReports?: number;
    readonly closedReports?: number;
    readonly finalizedReports?: number;
    readonly total_zob_reports?: number;
    readonly total_cps_reports?: number;
    readonly total_abi_reports?: number;
    readonly total_request_report_pending?: number;
    readonly total_request_report_rejected?: number;
    readonly total_reports_in_processing?: number;
    readonly total_reports_finalized?: number;
    readonly total_reports_evaluated?: number;
    readonly treatmentRate?: number;
    readonly approvalRate?: number;
    readonly averageTreatmentTime?: number;
    readonly completionRate?: number;
    readonly responseTime?: number;
    readonly last_refresh_at: string;
}

export type DashboardResponseApiDto = SimpleResponseDto<DashboardItemApiDto>;
