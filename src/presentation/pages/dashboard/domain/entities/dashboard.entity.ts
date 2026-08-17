import { DashboardProps } from '@pages/dashboard/domain/interfaces/dashboard-props.interface';

export class DashboardEntity {
    constructor(private readonly props: DashboardProps) {}

    get totalReports(): string {
        return this.props.totalReports;
    }

    get partialOperatorReports(): number {
        return this.props.partialOperatorReports ?? 0;
    }

    get pendingReports(): number {
        return this.props.pendingReports ?? 0;
    }

    get approvedReports(): number {
        return this.props.approvedReports ?? 0;
    }

    get rejectedReports(): number {
        return this.props.rejectedReports ?? 0;
    }

    get inTreatmentReports(): number {
        return this.props.inTreatmentReports ?? 0;
    }

    get closedReports(): number {
        return this.props.closedReports ?? 0;
    }

    get finalizedReports(): number {
        return this.props.finalizedReports ?? 0;
    }

    get whiteZoneReports(): number {
        return this.props.whiteZoneReports ?? 0;
    }

    get partialSignalReports(): number {
        return this.props.partialSignalReports ?? 0;
    }

    get noInternetReports(): number {
        return this.props.noInternetReports ?? 0;
    }

    get totalReportsPending(): number {
        return this.props.totalReportsPending ?? 0;
    }

    get totalReportsInProcessing(): number {
        return this.props.totalReportsInProcessing ?? 0;
    }

    get totalReportsProcessed(): number {
        return this.props.totalReportsProcessed ?? 0;
    }

    get totalReportsFinalized(): number {
        return this.props.totalReportsFinalized ?? 0;
    }

    get totalReportsEvaluated(): number {
        return this.props.totalReportsEvaluated ?? 0;
    }

    get treatmentRate(): number {
        return this.props.treatmentRate ?? 0;
    }

    get approvalRate(): number {
        return this.props.approvalRate ?? 0;
    }

    get averageTreatmentTime(): number {
        return this.props.averageTreatmentTime ?? 0;
    }

    get completionRate(): number {
        return this.props.completionRate ?? 0;
    }

    get responseTime(): number {
        return this.props.responseTime ?? 0;
    }

    get lastRefreshAt(): string {
        return this.props.lastRefreshAt;
    }

    public get totalActive(): number {
        return (this.pendingReports ?? 0) + (this.inTreatmentReports ?? 0);
    }

    public with(updates: Partial<DashboardProps>): DashboardEntity {
        const hasChanges = Object.keys(updates).some(
            (key) =>
                this.props[key as keyof DashboardProps] !==
                updates[key as keyof DashboardProps]
        );

        if (!hasChanges) {
            return this;
        }

        return new DashboardEntity({
            ...this.props,
            ...updates,
        });
    }
}
