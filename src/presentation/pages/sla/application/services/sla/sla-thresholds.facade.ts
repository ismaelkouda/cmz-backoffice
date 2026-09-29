import { Injectable, inject, signal } from '@angular/core';
import { SlaThresholdsApi } from '@pages/sla/infrastructure/data/sources/sla/sla-thresholds.api';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { finalize } from 'rxjs';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';

export interface ReportTypeVm {
    id: number;
    slaId: number;
    slaType: string;
    slaName: string;
    slaDescription: string;
    slaCategory: string;
    reportTypeId: number;
    reportTypeCode: string;
    reportTypeName: string;
    threshold: number;
    unit: string;
    channel: string;
    createdAt: string;
    updatedAt: string;
}
@Injectable({ providedIn: 'root' })
export class SlaThresholdsFacade {
    private readonly api = inject(SlaThresholdsApi);
    private readonly ui = inject(UiFeedbackService);
    readonly reportTypes = signal<ReportTypeVm[]>([]);
    readonly loading = signal(false);

    readReportTypes(slaType?: string, channel?: string): void {
        this.loading.set(true);
        this.api
            .reportTypes(slaType, channel)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (response) =>
                    this.reportTypes.set(
                        response.data.map((item) => ({
                            id: item.id,
                            slaId: item.sla_id,
                            slaType: item.sla_type,
                            slaName: item.sla_name,
                            slaDescription: item.sla_description,
                            slaCategory: item.sla_category,
                            reportTypeId: item.report_type_id,
                            reportTypeCode: item.report_type,
                            reportTypeName: item.report_type_name,
                            threshold: Number.parseInt(item.threshold, 10) || 0,
                            unit: item.unit,
                            channel: item.channel
                                .toLowerCase()
                                .replaceAll(' ', '_'),
                            createdAt: item.created_at,
                            updatedAt: item.updated_at,
                        }))
                    ),
                error: (error) => this.ui.notifyError(error),
            });
    }

    updateReportSla(
        id: number,
        payload: object,
        onSuccess: () => void,
        onError: () => void
    ): void {
        handleObservableWithFeedback(
            this.api.updateReportSla(id, payload),
            this.ui,
            'COMMON.SUCCESS.UPDATE'
        ).subscribe({
            next: () => onSuccess(),
            error: () => onError(),
        });
    }
}
