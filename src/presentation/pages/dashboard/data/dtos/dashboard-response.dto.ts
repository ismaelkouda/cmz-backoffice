export interface DashboardStatisticsDataDto {
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
    readonly qualificationReports?: number;
    readonly assignmentReports?: number;
    readonly treatmentReports?: number;
    readonly finalizationReports?: number;
    readonly evaluationReports?: number;
    readonly treatmentRate?: number;
    readonly approvalRate?: number;
    readonly averageTreatmentTime?: number;
    readonly completionRate?: number;
    readonly responseTime?: number;
    readonly date_derniere_maj?: string;
}

export interface DashboardResponseDto {
    readonly data: DashboardStatisticsDataDto | null;
    readonly error: boolean;
    readonly message: string;
}

