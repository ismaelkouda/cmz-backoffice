export interface DashboardStatistics {
    readonly totalReports?: number;
    readonly partialOperatorReports?: number;
    readonly pendingReports?: number;
    readonly approvedReports?: number;
    readonly rejectedReports?: number;
    readonly inTreatmentReports?: number;
    readonly closedReports?: number;
    readonly finalizedReports?: number;
    readonly whiteZoneReports?: number;
    readonly partialSignalReports?: number;
    readonly noInternetReports?: number;
    readonly totalReportsPending?: number;
    readonly totalReportsInProcessing?: number;
    readonly totalReportsProcessed?: number;
    readonly totalReportsFinalized?: number;
    readonly totalReportsEvaluated?: number;
    readonly treatmentRate?: number;
    readonly approvalRate?: number;
    readonly averageTreatmentTime?: number;
    readonly completionRate?: number;
    readonly responseTime?: number;
    readonly lastRefreshAt?: string;
}
