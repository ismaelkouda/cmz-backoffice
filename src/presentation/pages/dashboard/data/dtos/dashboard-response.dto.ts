export interface DashboardStatisticsDataDto {
    readonly total_reports?: number;
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
    readonly total_reports_pending?: number;
    readonly total_reports_in_processing?: number;
    readonly total_reports_processed?: number;
    readonly total_reports_finalized?: number;
    readonly total_reports_evaluated?: number;
    readonly treatmentRate?: number;
    readonly approvalRate?: number;
    readonly averageTreatmentTime?: number;
    readonly completionRate?: number;
    readonly responseTime?: number;
    readonly last_refresh_at?: string;
}

export interface DashboardResponseDto {
    readonly data: DashboardStatisticsDataDto | null;
    readonly error: boolean;
    readonly message: string;
}
