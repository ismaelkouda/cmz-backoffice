import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { ActionsPayloadEntity } from '../domain/entities/actions/actions-payload.entity';
import { ActionsEntity } from '../domain/entities/actions/actions.entity';
import { FetchActionsUseCase } from '../domain/use-cases/actions.use-case';
import { CreateActionUseCase } from '../domain/use-cases/create-action.use-case';
import { DeleteActionUseCase } from '../domain/use-cases/delete-action.use-case';
import { UpdateActionUseCase } from '../domain/use-cases/update-action.use-case';
import { ActionsFilter } from '../domain/value-objects/actions-filter.vo';

@Injectable({ providedIn: 'root' })
export class ActionsFacade extends BaseFacade<ActionsEntity, ActionsFilter> {
    readonly actions$: Observable<ActionsEntity[]> = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    constructor(
        private readonly fetchUseCase: FetchActionsUseCase,
        private readonly createUseCase: CreateActionUseCase,
        private readonly updateUseCase: UpdateActionUseCase,
        private readonly deleteUseCase: DeleteActionUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchActions(
        filter: ActionsFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        forceRefresh: boolean = false
    ): void {
        if (!this.shouldFetch(forceRefresh)) {
            return;
        }
        const fetch = this.fetchUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    createAction(payload: ActionsPayloadEntity): Observable<{ id: string }> {
        return this.createUseCase.execute(payload)
        .pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant(
                        'MANAGEMENT.ACTIONS.SUCCESS.CREATED'
                    )
                );
                this.refresh();
            })
        );
    }

    updateAction(id: string, payload: ActionsPayloadEntity): Observable<void> {
        return this.updateUseCase.execute(id, payload).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant(
                        'MANAGEMENT.ACTIONS.SUCCESS.UPDATED'
                    )
                );
                this.refresh();
            })
        );
    }

    deleteAction(id: string): Observable<void> {
        return this.deleteUseCase.execute(id).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant(
                        'MANAGEMENT.ACTIONS.SUCCESS.DELETED'
                    )
                );
                this.refresh();
            })
        );
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchUseCase.execute(
            currentFilter,
            String(pageNumber)
        );
        this.changePageInternal(pageNumber, fetch$);

        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const currentPage = this.pageSubject.getValue();
        const fetch$ = this.fetchUseCase.execute(currentFilter, currentPage);
        this.fetchData(currentFilter, currentPage, fetch$);

        this.lastFetchTimestamp = Date.now();
    }

    private shouldFetch(forceRefresh: boolean): boolean {
        if (forceRefresh) {
            return true;
        }
        if (!this.hasInitialized) {
            return true;
        }
        const isStale =
            Date.now() - this.lastFetchTimestamp > this.STALE_TIME;
        if (isStale) {
            console.log('🕐 [ActionsFacade] Data is stale, refetching');
            return true;
        }
        const hasData = this.itemsSubject.getValue().length > 0;
        if (!hasData) {
            return true;
        }

        return false;
    }

    resetMemory(): void {
        this.hasInitialized = false;
        this.lastFetchTimestamp = 0;
        this.reset();
    }

    getMemoryStatus(): {
        hasInitialized: boolean;
        lastFetch: number;
        hasData: boolean;
    } {
        return {
            hasInitialized: this.hasInitialized,
            lastFetch: this.lastFetchTimestamp,
            hasData: this.itemsSubject.getValue().length > 0,
        };
    }
}
