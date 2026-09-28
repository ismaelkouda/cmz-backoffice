import { Injectable, inject, signal } from '@angular/core';
import { SlaThresholdsApi } from '@pages/sla/infrastructure/data/sources/sla/sla-thresholds.api';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, tap, throwError } from 'rxjs';

export interface ReportTypeVm {
    id: number;
    name: string;
    description: string;
    reportSlasCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface ReportSlaVm {
    id: number;
    reportTypeId: number;
    slaId: number;
    slaName: string;
    slaDescription: string;
    channel: string;
    delay: number;
    escalationDelay: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface SlaOptionVm {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class SlaThresholdsFacade {
    private readonly api = inject(SlaThresholdsApi);
    private readonly ui = inject(UiFeedbackService);
    readonly reportTypes = signal<ReportTypeVm[]>([]);
    readonly reportSystems = signal<ReportTypeVm[]>([]);
    readonly reportSlas = signal<ReportSlaVm[]>([]);
    readonly slaOptions = signal<SlaOptionVm[]>([]);
    readonly loading = signal(false);

    readReportTypes(search?: string): void {
        this.loading.set(true);
        this.api
            .reportTypes(search)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (response) =>
                    this.reportTypes.set(
                        response.data.map((item) => ({
                            id: item.id,
                            name: item.name,
                            description: item.description,
                            reportSlasCount: item.report_slas_count,
                            isActive: item.is_active,
                            createdAt: item.created_at,
                            updatedAt: item.updated_at,
                        }))
                    ),
                error: (error) => this.ui.notifyError(error),
            });
    }
    readReportSystems(search?: string): void {
        this.loading.set(true);
        this.api
            .reportSystems(search)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (response) =>
                    this.reportSystems.set(
                        response.data.map((item) => ({
                            id: item.id,
                            name: item.sla_name,
                            description: item.description,
                            reportSlasCount: 0,
                            isActive: item.is_active,
                            createdAt: item.created_at,
                            updatedAt: item.updated_at,
                        }))
                    ),
                error: (error) => this.ui.notifyError(error),
            });
    }
    createSystem(payload: object, refresh: () => void): void {
        this.action(
            this.api.createSystem(payload),
            'COMMON.SUCCESS.CREATE',
            refresh
        );
    }
    updateSystem(id: number, payload: object, refresh: () => void): void {
        this.action(
            this.api.updateSystem(id, payload),
            'COMMON.SUCCESS.UPDATE',
            refresh
        );
    }
    enableSystem(id: number, refresh: () => void): void {
        this.action(
            this.api.enableSystem(id),
            'COMMON.SUCCESS.ENABLE',
            refresh
        );
    }
    disableSystem(id: number, refresh: () => void): void {
        this.action(
            this.api.disableSystem(id),
            'COMMON.SUCCESS.DISABLE',
            refresh
        );
    }
    deleteSystem(id: number, refresh: () => void): void {
        this.action(
            this.api.deleteSystem(id),
            'COMMON.SUCCESS.DELETE',
            refresh
        );
    }
    readSlaOptions(): void {
        this.api.slaOptions().subscribe({
            next: (response) => this.slaOptions.set(response.data),
            error: (error) => this.ui.notifyError(error),
        });
    }
    readReportSlas(channel: string, reportTypeId: number): void {
        this.loading.set(true);
        this.api
            .reportSlas(channel, reportTypeId)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (response) =>
                    this.reportSlas.set(
                        response.data.map((item) => ({
                            id: item.id,
                            reportTypeId: item.report_type_id,
                            slaId: item.sla_id,
                            slaName: item.sla_name,
                            slaDescription: item.sla_description,
                            channel: item.channel,
                            delay: item.delay,
                            escalationDelay: item.escalation_delay,
                            isActive: item.is_active,
                            createdAt: item.created_at,
                            updatedAt: item.updated_at,
                        }))
                    ),
                error: (error) => this.ui.notifyError(error),
            });
    }
    create(payload: object, refresh: () => void): void {
        this.action(this.api.create(payload), 'COMMON.SUCCESS.CREATE', refresh);
    }
    update(id: number, payload: object, refresh: () => void): void {
        this.action(
            this.api.update(id, payload),
            'COMMON.SUCCESS.UPDATE',
            refresh
        );
    }
    enable(id: number, refresh: () => void): void {
        this.action(this.api.enable(id), 'COMMON.SUCCESS.ENABLE', refresh);
    }
    disable(id: number, refresh: () => void): void {
        this.action(this.api.disable(id), 'COMMON.SUCCESS.DISABLE', refresh);
    }
    delete(id: number, refresh: () => void): void {
        this.action(this.api.delete(id), 'COMMON.SUCCESS.DELETE', refresh);
    }
    private action(
        request: any,
        successKey: string,
        refresh: () => void
    ): void {
        request
            .pipe(
                tap(() => {
                    this.ui.success(successKey);
                    refresh();
                }),
                catchError((error: any) => {
                    this.ui.notifyError(error);
                    return throwError(() => error);
                })
            )
            .subscribe();
    }
}
