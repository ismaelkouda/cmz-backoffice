import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { separatorThousands } from '@shared/domain/functions/separator-thousands';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { DashboardEntity } from '@presentation/pages/dashboard/domain/entities/dashboard.entity';
import { DashboardProps } from '@presentation/pages/dashboard/domain/interfaces/dashboard-props.interface';
import { DashboardItemApiDto } from '@presentation/pages/dashboard/infrastructure/api/dto/dashboard-response-api.dto';

@Injectable({ providedIn: 'root' })
export class DashboardMapper extends SimpleResponseMapper<
    DashboardEntity,
    DashboardItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, DashboardEntity>();

    protected mapItemFromDto(dto: DashboardItemApiDto): DashboardEntity {
        // MapperUtils.validateDto(dto, { required: ['uniq_id'] });

        const props: DashboardProps = {
            totalReports: separatorThousands(dto.total_reports),
            partialOperatorReports: dto.total_cpo_reports,
            pendingReports: dto.pendingReports,
            approvedReports: dto.approvedReports,
            rejectedReports: dto.rejectedReports,
            inTreatmentReports: dto.inTreatmentReports,
            closedReports: dto.closedReports,
            finalizedReports: dto.finalizedReports,
            whiteZoneReports: dto.total_zob_reports,
            partialSignalReports: dto.total_cps_reports,
            noInternetReports: dto.total_abi_reports,
            totalReportsPending: dto.total_reports_pending,
            totalReportsInProcessing: dto.total_reports_in_processing,
            totalReportsProcessed: dto.total_reports_processed,
            totalReportsFinalized: dto.total_reports_finalized,
            totalReportsEvaluated: dto.total_reports_evaluated,
            treatmentRate: dto.treatmentRate,
            approvalRate: dto.approvalRate,
            averageTreatmentTime: dto.averageTreatmentTime,
            completionRate: dto.completionRate,
            responseTime: dto.responseTime,
            lastRefreshAt: dto.last_refresh_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new DashboardEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
