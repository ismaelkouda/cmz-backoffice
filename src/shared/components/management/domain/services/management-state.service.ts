import { Injectable, inject, signal, computed, Signal } from '@angular/core';
import { DetailsFacade as FinalizationFacade } from '@pages/finalization/application/services/details/details.facade';
import { DetailsFacade as ProcessingFacade } from '@pages/processing/application/services/details/details.facade';
import { DetailsFacade as RequestsFacade } from '@pages/requests/application/services/details/details.facade';

import { Actions } from '../types/management-actions.type';

export type ManagementContext =
    | 'requests'
    | 'processing'
    | 'finalization'
    | null;

@Injectable()
export class ManagementStateService {
    private readonly requestsFacade = inject(RequestsFacade);
    private readonly processingFacade = inject(ProcessingFacade);
    private readonly finalizationFacade = inject(FinalizationFacade);

    private readonly context = signal<ManagementContext>(null);
    private readonly uniqId = signal<string>('');

    readonly requestsItems = this.requestsFacade.items;
    readonly requestsLoading = this.requestsFacade.loading;

    readonly processingItems = this.processingFacade.items;
    readonly processingLoading = this.processingFacade.loading;

    readonly finalizationItems = this.finalizationFacade.items;
    readonly finalizationLoading = this.finalizationFacade.loading;

    readonly requestsActionState = this.requestsFacade.actionLoading;
    readonly requestsActionSuccess = this.requestsFacade.actionSuccess;

    readonly processingActionState = this.processingFacade.actionLoading;
    readonly processingActionSuccess = this.processingFacade.actionSuccess;

    readonly finalizationActionState = this.finalizationFacade.actionLoading;
    readonly finalizationActionSuccess = this.finalizationFacade.actionSuccess;

    readonly items: Signal<Actions> = computed(() => {
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
        console.log('ctx: ', ctx);
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
                this.requestsFacade.read(dto, true);
                break;
            case 'processing':
                this.processingFacade.read(dto, true);
                break;
            case 'finalization':
                this.finalizationFacade.read(dto, true);
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
        console.log('action executeFinalizationAction: ', action);
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
    }
}
