import { Injectable } from '@angular/core';
import { DashboardResponseDto } from '@pages/dashboard/data/dtos/dashboard-response.dto';
import { DashboardStatistics } from '@pages/dashboard/domain/entities/dashboard-statistics.entity';

@Injectable({ providedIn: 'root' })
export class DashboardMapper {
    mapFromDto(dto: DashboardResponseDto): DashboardStatistics {
        if (dto.error || !dto.data) {
            throw new Error(
                dto.message || 'DASHBOARD.MESSAGES.ERROR.FAILED_TO_LOAD'
            );
        }

        return {
            totalReports: dto.data.total_reports,
            partialOperatorReports: dto.data.total_cpo_reports,
            pendingReports: dto.data.pendingReports,
            approvedReports: dto.data.approvedReports,
            rejectedReports: dto.data.rejectedReports,
            inTreatmentReports: dto.data.inTreatmentReports,
            closedReports: dto.data.closedReports,
            finalizedReports: dto.data.finalizedReports,
            whiteZoneReports: dto.data.total_zob_reports,
            partialSignalReports: dto.data.total_cps_reports,
            noInternetReports: dto.data.total_abi_reports,
            totalReportsPending: dto.data.total_reports_pending,
            totalReportsInProcessing: dto.data.total_reports_in_processing,
            totalReportsProcessed: dto.data.total_reports_processed,
            totalReportsFinalized: dto.data.total_reports_finalized,
            totalReportsEvaluated: dto.data.total_reports_evaluated,
            treatmentRate: dto.data.treatmentRate,
            approvalRate: dto.data.approvalRate,
            averageTreatmentTime: dto.data.averageTreatmentTime,
            completionRate: dto.data.completionRate,
            responseTime: dto.data.responseTime,
            dateDerniereMaj: dto.data.date_derniere_maj,
        };
    }
}
