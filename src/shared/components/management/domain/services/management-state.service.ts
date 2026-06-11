import { Injectable, inject, signal, computed, Signal } from '@angular/core';
// import { DetailsFacade as FinalizationFacade } from '@pages/finalization/application/services/details/details.facade';
import { NotificationsFacade } from '@pages/communication/application/services/notifications/notifications.facade';
import { DetailsFacade as ProcessingFacade } from '@pages/processing/application/services/details/details.facade';
import { DetailsFacade as RequestsFacade } from '@pages/requests/application/services/details/details.facade';
import { ManagementEntityType } from '@shared/components/management/domain/types/management-entity.type';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';

@Injectable()
export class ManagementStateService {
    private readonly requestsFacade = inject(RequestsFacade);
    private readonly processingFacade = inject(ProcessingFacade);
    protected readonly notificationFacade = inject(NotificationsFacade);
    // private readonly finalizationFacade = inject(FinalizationFacade);
    private readonly permissionActions = inject(PermissionActionsService);

    private readonly context = signal<TypeReport | null>(null);
    private readonly uniqId = signal<string>('');

    readonly requestsItems = this.requestsFacade.items;
    readonly requestsLoading = this.requestsFacade.loading;

    readonly processingItems = this.processingFacade.items;
    readonly processingLoading = this.processingFacade.loading;

    // readonly finalizationItems = this.finalizationFacade.items;
    // readonly finalizationLoading = this.finalizationFacade.loading;

    readonly requestsActionState = this.requestsFacade.actionLoading;
    readonly requestsActionSuccess = this.requestsFacade.actionSuccess;

    readonly processingActionState = this.processingFacade.actionLoading;
    readonly processingActionSuccess = this.processingFacade.actionSuccess;

    // readonly finalizationActionState = this.finalizationFacade.actionLoading;
    // readonly finalizationActionSuccess = this.finalizationFacade.actionSuccess;

    readonly items: Signal<ManagementEntityType> = computed(() => {
        const ctx = this.context();
        switch (ctx) {
            case 'requests':
                return this.requestsItems();
            case 'processing':
                return this.processingItems();
            // case 'finalization':
            //     return this.finalizationItems();
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
            // case 'finalization':
            //     return this.finalizationLoading();
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
            // case 'finalization':
            //     return this.finalizationActionState();
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
            // case 'finalization':
            //     return this.finalizationActionSuccess();
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
            // case 'finalization':
            //     return this.finalizationFacade.actionError();
            default:
                return null;
        }
    });

    initialize(
        context: TypeReport,
        uniqId: string,
        isNotification: boolean
    ): void {
        if (!context || !uniqId) {
            return;
        }

        this.context.set(context);
        this.uniqId.set(uniqId);

        const dto = { uniqId };

        if (isNotification) {
            this.notificationFacade.readOne(dto);
        }

        switch (context) {
            case 'requests':
                this.requestsFacade.read(dto, { forceRefresh: true });
                break;
            case 'processing':
                this.processingFacade.read(dto, { forceRefresh: true });
                break;
            // case 'finalization':
            //     this.finalizationFacade.read(dto);
            //     break;
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
            // case 'finalization':
            //     this.executeFinalizationAction(action, { ...payload, uniqId });
            //     break;
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

    // private executeFinalizationAction(action: string, payload: any): void {
    //     switch (action) {
    //         case 'take':
    //             this.finalizationFacade.take(payload);
    //             break;
    //         case 'finalize':
    //             this.finalizationFacade.finalize(payload);
    //             break;
    //     }
    // }

    readonly canTake = computed(() => {
        const ctx = this.context();

        switch (ctx) {
            case 'requests':
                return this.permissionActions.can('/requests/queues', 'take')();
            case 'processing':
                return this.permissionActions.can(
                    '/reports-processing/queues',
                    'take'
                )();
            case 'finalization':
                return this.permissionActions.can(
                    '/reports-finalization/queues',
                    'take'
                )();
            default:
                return false;
        }
    });

    readonly sweetAlert: Signal<{ title: string; message: string }> = computed(
        () => {
            const ctx = this.context();
            const canTake = this.canTake();

            switch (ctx) {
                case 'requests':
                    return canTake
                        ? {
                              title: 'REQUESTS.QUEUES.SWEET_ALERT.TITLE.TAKE',
                              message:
                                  'REQUESTS.QUEUES.SWEET_ALERT.MESSAGE.TAKE',
                          }
                        : {
                              title: 'REQUESTS.QUEUES.SWEET_ALERT.TITLE.NOT_TAKE',
                              message:
                                  'REQUESTS.QUEUES.SWEET_ALERT.MESSAGE.NOT_TAKE',
                          };
                case 'processing':
                    return canTake
                        ? {
                              title: 'PROCESSING.QUEUES.SWEET_ALERT.TITLE.TAKE',
                              message:
                                  'PROCESSING.QUEUES.SWEET_ALERT.MESSAGE.TAKE',
                          }
                        : {
                              title: 'PROCESSING.QUEUES.SWEET_ALERT.TITLE.NOT_TAKE',
                              message:
                                  'PROCESSING.QUEUES.SWEET_ALERT.MESSAGE.NOT_TAKE',
                          };
                case 'finalization':
                    return canTake
                        ? {
                              title: 'FINALIZATION.QUEUES.SWEET_ALERT.TITLE.TAKE',
                              message:
                                  'FINALIZATION.QUEUES.SWEET_ALERT.MESSAGE.TAKE',
                          }
                        : {
                              title: 'FINALIZATION.QUEUES.SWEET_ALERT.TITLE.NOT_TAKE',
                              message:
                                  'FINALIZATION.QUEUES.SWEET_ALERT.MESSAGE.NOT_TAKE',
                          };
                default:
                    return {
                        title: 'COMMON.SWEET_ALERT.TITLE.TAKE',
                        message: 'COMMON.SWEET_ALERT.MESSAGE.TAKE',
                    };
            }
        }
    );

    readonly canQualify = computed(() => {
        return this.permissionActions.can('/requests/tasks', 'qualify')();
    });

    readonly canTreat = computed(() => {
        return this.permissionActions.can(
            '/reports-processing/tasks',
            'treat'
        )();
    });

    readonly canFinalize = computed(() => {
        return this.permissionActions.can(
            '/reports-finalization/tasks',
            'finalize'
        )();
    });

    reset(): void {
        this.context.set(null);
        this.uniqId.set('');

        this.requestsFacade.resetActionState();
        this.processingFacade.resetActionState();
        // this.finalizationFacade.resetActionState();
    }
}
