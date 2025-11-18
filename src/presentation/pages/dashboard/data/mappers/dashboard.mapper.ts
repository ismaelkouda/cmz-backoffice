import { Injectable } from '@angular/core';
import { DashboardStatistics } from '@pages/dashboard/domain/entities/dashboard-statistics.entity';
import { DashboardResponseDto } from '@pages/dashboard/data/dtos/dashboard-response.dto';

@Injectable({ providedIn: 'root' })
export class DashboardMapper {
    mapFromDto(dto: DashboardResponseDto): DashboardStatistics {
        if (dto.error || !dto.data) {
            throw new Error(
                dto.message || 'DASHBOARD.MESSAGES.ERROR.FAILED_TO_LOAD'
            );
        }

        return {
            totalReports: dto.data.totalReports,
            partialOperatorReports: dto.data.partialOperatorReports,
            pendingReports: dto.data.pendingReports,
            approvedReports: dto.data.approvedReports,
            rejectedReports: dto.data.rejectedReports,
            inTreatmentReports: dto.data.inTreatmentReports,
            closedReports: dto.data.closedReports,
            finalizedReports: dto.data.finalizedReports,
            whiteZoneReports: dto.data.whiteZoneReports,
            partialSignalReports: dto.data.partialSignalReports,
            noInternetReports: dto.data.noInternetReports,
            qualificationReports: dto.data.qualificationReports,
            assignmentReports: dto.data.assignmentReports,
            treatmentReports: dto.data.treatmentReports,
            finalizationReports: dto.data.finalizationReports,
            evaluationReports: dto.data.evaluationReports,
            treatmentRate: dto.data.treatmentRate,
            approvalRate: dto.data.approvalRate,
            averageTreatmentTime: dto.data.averageTreatmentTime,
            completionRate: dto.data.completionRate,
            responseTime: dto.data.responseTime,
            date_derniere_maj: dto.data.date_derniere_maj,
        };
    }
}

