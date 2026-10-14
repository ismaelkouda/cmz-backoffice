import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { SlaEscalationContactEntity } from '@pages/sla/domain/entities/sla/sla-escalation-contact.entity';
import {
    SlaEscalationContactFilterApiDto,
    SlaEscalationContactPayloadApiDto,
} from '@pages/sla/infrastructure/api/dto/sla/sla-escalation-contact-response-api.dto';
import { SlaEscalationContactMapper } from '@pages/sla/infrastructure/data/mappers/sla/sla-escalation-contact.mapper';
import { SlaEscalationContactsApi } from '@pages/sla/infrastructure/data/sources/sla/sla-escalation-contacts.api';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { Paginate } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class SlaEscalationContactsFacade {
    private readonly api = inject(SlaEscalationContactsApi);
    private readonly mapper = inject(SlaEscalationContactMapper);
    private readonly ui = inject(UiFeedbackService);

    readonly items = signal<SlaEscalationContactEntity[]>([]);
    readonly pagination = signal<Paginate<
        SlaEscalationContactEntity,
        undefined
    > | null>(null);
    readonly selected = signal<SlaEscalationContactEntity | null>(null);
    readonly loading = signal(false);
    readonly actionLoading = signal(false);
    readonly detailLoading = signal(false);

    clearSelection(): void {
        this.selected.set(null);
    }

    private currentFilter: SlaEscalationContactFilterApiDto = {};
    private currentPage = 1;

    refresh(): void {
        this.currentFilter = {};
        this.currentPage = 1;
        this.readAll({}, 1);
    }

    readAll(filter: SlaEscalationContactFilterApiDto = {}, page = 1): void {
        this.currentFilter = filter;
        this.currentPage = page;
        this.loading.set(true);
        this.api
            .readAll(filter, page)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (response) => {
                    const data = response.data.data.map((item) =>
                        this.mapper.map(item)
                    );
                    this.items.set(data);
                    this.pagination.set({
                        ...response.data,
                        data,
                        stats: undefined,
                    });
                },
                error: (error) => this.ui.notifyError(error),
            });
    }

    findOne(id: string): void {
        this.detailLoading.set(true);
        this.api
            .findOne(id)
            .pipe(finalize(() => this.detailLoading.set(false)))
            .subscribe({
                next: (response) =>
                    this.selected.set(this.mapper.map(response.data)),
                error: (error) => this.ui.notifyError(error),
            });
    }

    create(
        payload: SlaEscalationContactPayloadApiDto,
        onSuccess: () => void
    ): void {
        this.runAction(
            this.api.create(payload),
            'COMMON.SUCCESS.CREATE',
            onSuccess
        );
    }

    update(
        id: string,
        payload: SlaEscalationContactPayloadApiDto,
        onSuccess: () => void
    ): void {
        this.runAction(
            this.api.update(id, payload),
            'COMMON.SUCCESS.UPDATE',
            onSuccess
        );
    }

    enable(id: string): void {
        this.runAction(this.api.enable(id), 'COMMON.SUCCESS.ENABLE', () =>
            this.readAll(this.currentFilter, this.currentPage)
        );
    }

    disable(id: string): void {
        this.runAction(this.api.disable(id), 'COMMON.SUCCESS.DISABLE', () =>
            this.readAll(this.currentFilter, this.currentPage)
        );
    }

    remove(id: string): void {
        this.runAction(this.api.remove(id), 'COMMON.SUCCESS.DELETE', () =>
            this.readAll(this.currentFilter, this.currentPage)
        );
    }

    private runAction<T>(
        request$: import('rxjs').Observable<T>,
        successKey: string,
        onSuccess: () => void
    ): void {
        this.actionLoading.set(true);
        handleObservableWithFeedback(request$, this.ui, successKey, onSuccess)
            .pipe(finalize(() => this.actionLoading.set(false)))
            .subscribe();
    }
}
