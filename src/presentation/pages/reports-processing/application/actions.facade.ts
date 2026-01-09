import { inject, Injectable } from '@angular/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { handleObservableWithFeedback, shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { Observable } from 'rxjs';
import { ActionsPayloadEntity } from '../domain/entities/actions/actions-payload.entity';
import { ActionsEntity } from '../domain/entities/actions/actions.entity';
import { FetchActionsUseCase } from '../domain/use-cases/actions.use-case';
import { CreateActionUseCase } from '../domain/use-cases/create-action.use-case';
import { DeleteActionUseCase } from '../domain/use-cases/delete-action.use-case';
import { UpdateActionUseCase } from '../domain/use-cases/update-action.use-case';
import { ActionsFilter } from '../domain/value-objects/actions-filter.vo';

@Injectable({ providedIn: 'root' })
export class ActionsFacade extends BaseFacade<ActionsEntity, ActionsFilter> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(FetchActionsUseCase);
    private readonly createUseCase = inject(CreateActionUseCase);
    private readonly updateUseCase = inject(UpdateActionUseCase);
    private readonly deleteUseCase = inject(DeleteActionUseCase);

    readonly actions$: Observable<ActionsEntity[]> = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(observable: Observable<T>, successKey: string): Observable<T> {
        return handleObservableWithFeedback(observable, this.uiFeedbackService, successKey, () => this.refresh());
    }

    fetchActions(filter: ActionsFilter, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
        const hasData = this.itemsSubject.getValue().length > 0;
        if (!shouldFetch(forceRefresh, hasData, this.lastFetchTimestamp, this.STALE_TIME)) return;

        this.fetchWithFilterAndPage(filter, page, this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) return;

        const firstPage = PAGINATION_CONST.DEFAULT_PAGE;
        this.pageSubject.next(firstPage);

        this.fetchWithFilterAndPage(currentFilter, firstPage, this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);

        this.lastFetchTimestamp = Date.now();
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) return;

        this.fetchWithFilterAndPage(currentFilter, String(pageNumber), this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);

        this.lastFetchTimestamp = Date.now();
    }

    createAction(payload: ActionsPayloadEntity): Observable<{ id: string }> {
        return this.handleActionWithRefresh(this.createUseCase.execute(payload), 'COMMON.SUCCESS.CREATE');
    }

    updateAction(id: string, payload: ActionsPayloadEntity): Observable<void> {
        return this.handleActionWithRefresh(this.updateUseCase.execute(id, payload), 'COMMON.SUCCESS.UPDATE');
    }

    deleteAction(id: string): Observable<void> {
        return this.handleActionWithRefresh(this.deleteUseCase.execute(id), 'COMMON.SUCCESS.DELETE');
    }
}
