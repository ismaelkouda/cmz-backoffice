import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SlaThresholdsApi } from '@pages/sla/infrastructure/data/sources/sla/sla-thresholds.api';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { finalize } from 'rxjs';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';

function getThresholdType(value: string | number, unit: string): ThresholdType {
    if (unit.toUpperCase() === 'DATE') {
        return 'date';
    }
    if (unit.toUpperCase() === 'FCFA') {
        return 'currency';
    }
    return String(value).replace(/\s/g, '').includes('.')
        ? 'decimal'
        : 'integer';
}

function parseThreshold(value: string | number, unit: string): ThresholdValue {
    if (unit.toUpperCase() === 'DATE') {
        return String(value);
    }

    const normalized = String(value)
        .replace(/\s/g, '')
        .replace(/[^\d.-]/g, '');
    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : 0;
}

export type ThresholdValue = number | string;
export type ThresholdType = 'integer' | 'decimal' | 'currency' | 'date';

export interface ReportTypeVm {
    id: string | number;
    slaId: string | number;
    slaType: string;
    slaName: string;
    slaDescription: string;
    slaCategory: string;
    slaCategoryLabel: string;
    reportTypeId: string | number | null;
    reportTypeCode: string;
    reportTypeName: string;
    threshold: ThresholdValue;
    thresholdType: ThresholdType;
    thresholdLabel: string;
    unit: string;
    channel: string;
    createdAt: string;
    updatedAt: string;
}
@Injectable({ providedIn: 'root' })
export class SlaThresholdsFacade {
    private readonly api = inject(SlaThresholdsApi);
    private readonly ui = inject(UiFeedbackService);
    private readonly translate = inject(TranslateService);
    readonly reportTypes = signal<ReportTypeVm[]>([]);
    readonly channelOptions = signal<
        { id: string; name: string }[]
    >([]);
    readonly loading = signal(false);

    readChannelOptions(): void {
        this.api.channelOptions().subscribe({
            next: (response) => this.channelOptions.set(response.data),
            error: (error) => this.ui.notifyError(error),
        });
    }

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
                            slaCategoryLabel: this.t(
                                item.sla_category === 'system'
                                    ? 'SLA.SLA_LIST.CATEGORY.SYSTEM'
                                    : 'SLA.SLA_LIST.CATEGORY.JOB'
                            ),
                            reportTypeId: item.report_type_id ?? null,
                            reportTypeCode: item.report_type ?? '',
                            reportTypeName: item.report_type_name ?? '',
                            threshold: parseThreshold(
                                item.threshold,
                                item.unit
                            ),
                            thresholdType: getThresholdType(
                                item.threshold,
                                item.unit
                            ),
                            thresholdLabel: String(item.threshold),
                            unit: item.unit,
                            channel: item.channel.toLowerCase(),
                            createdAt: item.created_at,
                            updatedAt: item.updated_at,
                        }))
                    ),
                error: (error) => this.ui.notifyError(error),
            });
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    updateReportSla(
        id: string | number,
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
