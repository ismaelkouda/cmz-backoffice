import { Injectable, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import { DetailsFacade as FinalizationFacade } from '@presentation/pages/finalization/application/services/details/details.facade';
import { DetailsFacade as RequestsFacade } from '@presentation/pages/requests/application/services/details/details.facade';
import { DetailsFacade as ProcessingFacade } from '@presentation/pages/processing/application/services/details/details.facade';

export type ManagementContext =
    | 'requests'
    | 'processing'
    | 'finalization'
    | null;

@Injectable({ providedIn: 'root' })
export class ManagementStateService {
    private readonly requestsFacade = inject(RequestsFacade);
    private readonly processingFacade = inject(ProcessingFacade);
    private readonly finalizationFacade = inject(FinalizationFacade);

    private readonly context = signal<ManagementContext>(null);
    private readonly uniqId = signal<string>('');

    // Pour les items, nous devons les convertir en signaux à partir des observables
    readonly requestsItems = toSignal(
        this.requestsFacade.items$.pipe(filter(Boolean)),
        { initialValue: null }
    );

    readonly requestsLoading = toSignal(this.requestsFacade.isLoading$, {
        initialValue: false,
    });

    readonly processingItems = toSignal(
        this.processingFacade.items$.pipe(filter(Boolean)),
        { initialValue: null }
    );

    readonly processingLoading = toSignal(this.processingFacade.isLoading$, {
        initialValue: false,
    });

    readonly finalizationItems = toSignal(
        this.finalizationFacade.items$.pipe(filter(Boolean)),
        { initialValue: null }
    );

    readonly finalizationLoading = toSignal(
        this.finalizationFacade.isLoading$,
        { initialValue: false }
    );

    readonly requestsActionState = this.requestsFacade.actionState;
    readonly requestsActionSuccess = this.requestsFacade.actionSuccess;

    readonly processingActionState = this.processingFacade.actionState;
    readonly processingActionSuccess = this.processingFacade.actionSuccess;

    readonly finalizationActionState = this.finalizationFacade.actionState;
    readonly finalizationActionSuccess = this.finalizationFacade.actionSuccess;

    readonly items = computed(() => {
        const ctx = this.context();
        switch (ctx) {
            case 'requests':
                return this.requestsItems();
            case 'processing':
                return this.processingItems();
            case 'finalization':
                return this.finalizationItems();
            default:
                return null;
        }
    });

    readonly loading = computed(() => {
        const ctx = this.context();
        switch (ctx) {
            case 'requests':
                return this.requestsLoading();
            case 'processing':
                return this.processingLoading();
            case 'finalization':
                return this.finalizationLoading();
            default:
                return false;
        }
    });

    readonly actionState = computed(() => {
        const ctx = this.context();
        switch (ctx) {
            case 'requests':
                return this.requestsActionState();
            case 'processing':
                return this.processingActionState();
            case 'finalization':
                return this.finalizationActionState();
            default:
                return 'idle' as const;
        }
    });

    readonly actionSuccess = computed(() => {
        const ctx = this.context();
        switch (ctx) {
            case 'requests':
                return this.requestsActionSuccess();
            case 'processing':
                return this.processingActionSuccess();
            case 'finalization':
                return this.finalizationActionSuccess();
            default:
                return 0;
        }
    });

    readonly actionError = computed(() => {
        const ctx = this.context();
        switch (ctx) {
            case 'requests':
                return this.requestsFacade.actionError();
            case 'processing':
                return this.processingFacade.actionError();
            case 'finalization':
                return this.finalizationFacade.actionError();
            default:
                return null;
        }
    });

    initialize(context: ManagementContext, uniqId: string): void {
        if (!context || !uniqId) {
            return;
        }

        this.context.set(context);
        this.uniqId.set(uniqId);

        const dto = { uniqId };

        switch (context) {
            case 'requests':
                this.requestsFacade.read(dto);
                break;
            case 'processing':
                this.processingFacade.read(dto);
                break;
            case 'finalization':
                this.finalizationFacade.read(dto);
                break;
        }
    }

    executeAction(action: string, payload: any): void {
        const ctx = this.context();
        const uniqId = this.uniqId();

        if (!ctx || !uniqId) {
            return;
        }

        switch (ctx) {
            case 'requests':
                this.executeRequestsAction(action, { ...payload, uniqId });
                break;
            case 'processing':
                this.executeProcessingAction(action, { ...payload, uniqId });
                break;
            case 'finalization':
                this.executeFinalizationAction(action, { ...payload, uniqId });
                break;
        }
    }

    private executeRequestsAction(action: string, payload: any): void {
        switch (action) {
            case 'take':
                this.requestsFacade.take(payload);
                break;
            case 'approve':
                this.requestsFacade.approve(payload);
                break;
            case 'reject':
                this.requestsFacade.reject(payload);
                break;
        }
    }

    private executeProcessingAction(action: string, payload: any): void {
        switch (action) {
            case 'take':
                this.processingFacade.take(payload);
                break;
            case 'treat':
                this.processingFacade.treat(payload);
                break;
        }
    }

    private executeFinalizationAction(action: string, payload: any): void {
        switch (action) {
            case 'take':
                this.finalizationFacade.take(payload);
                break;
            case 'finalize':
                this.finalizationFacade.finalize(payload);
                break;
        }
    }

    refresh(forceRefresh = true): void {
        const ctx = this.context();
        const uniqId = this.uniqId();

        if (!ctx || !uniqId) {
            return;
        }

        const dto = { uniqId };

        switch (ctx) {
            case 'requests':
                this.requestsFacade.read(dto, forceRefresh);
                break;
            case 'processing':
                this.processingFacade.read(dto, forceRefresh);
                break;
            case 'finalization':
                this.finalizationFacade.read(dto, forceRefresh);
                break;
        }
    }

    reset(): void {
        this.context.set(null);
        this.uniqId.set('');

        // Optionnel : réinitialiser les facades si nécessaire
        // this.requestsFacade.resetMemory();
        // this.processingFacade.resetMemory();
        // this.finalizationFacade.resetMemory();
    }
}
