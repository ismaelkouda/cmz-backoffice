import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import { BaseFacade } from '@shared/application/services/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { NewsCreateCommand } from '@presentation/pages/content-management/application/commands/news/news-create.command';
import { NewsDeleteCommand } from '@presentation/pages/content-management/application/commands/news/news-delete.command';
import { NewsDisableCommand } from '@presentation/pages/content-management/application/commands/news/news-disable.command';
import { NewsEnableCommand } from '@presentation/pages/content-management/application/commands/news/news-enable.command';
import { NewsUpdateCommand } from '@presentation/pages/content-management/application/commands/news/news-update.command';
import { NewsCreateBus } from '@presentation/pages/content-management/application/commands-bus/news/news-create.bus';
import { NewsDeleteBus } from '@presentation/pages/content-management/application/commands-bus/news/news-delete.bus';
import { NewsDisableBus } from '@presentation/pages/content-management/application/commands-bus/news/news-disable.bus';
import { NewsEnableBus } from '@presentation/pages/content-management/application/commands-bus/news/news-enable.bus';
import { NewsUpdateBus } from '@presentation/pages/content-management/application/commands-bus/news/news-update.bus';
import { NewsCreateDto } from '@presentation/pages/content-management/application/dto/news/news-create.dto';
import { NewsDeleteDto } from '@presentation/pages/content-management/application/dto/news/news-delete.dto';
import { NewsDisableDto } from '@presentation/pages/content-management/application/dto/news/news-disable.dto';
import { NewsEnableDto } from '@presentation/pages/content-management/application/dto/news/news-enable.dto';
import { NewsFilterDto } from '@presentation/pages/content-management/application/dto/news/news-filter.dto';
import { NewsUpdateDto } from '@presentation/pages/content-management/application/dto/news/news-update.dto';
import { NewsQuery } from '@presentation/pages/content-management/application/queries/news/news.query';
import { NewsBus } from '@presentation/pages/content-management/application/queries-bus/news/news.bus';
import { NewsEntity } from '@presentation/pages/content-management/domain/entities/news/news.entity';

@Injectable({
    providedIn: 'root',
})
export class NewsFacade extends BaseFacade<NewsEntity, NewsFilterDto> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(NewsBus);
    private readonly createBus = inject(NewsCreateBus);
    private readonly updateBus = inject(NewsUpdateBus);
    private readonly enableBus = inject(NewsEnableBus);
    private readonly disableBus = inject(NewsDisableBus);
    private readonly deleteBus = inject(NewsDeleteBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey: string
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedbackService,
            successKey,
            () => this.refresh()
        );
    }

    readAll(
        filter: NewsFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        forceRefresh = false
    ): void {
        const hasData = this.itemsSubject.getValue().length > 0;
        if (
            !shouldFetch(
                forceRefresh,
                hasData,
                this.lastFetchTimestamp,
                this.STALE_TIME
            )
        ) {
            return;
        }

        const command = new NewsQuery(
            filter?.search,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(
            filter,
            page,
            fetch$,
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new NewsQuery(
            filter?.search,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(null, page, fetch$, this.uiFeedbackService);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        const command = new NewsQuery(
            filter?.search,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(
            filter,
            page,
            fetch$,
            this.uiFeedbackService
        );
        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new NewsQuery(
            filter?.search,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(
            filter,
            page,
            fetch$,
            this.uiFeedbackService
        );
        this.lastFetchTimestamp = Date.now();
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
            hasData: this.itemsSubject.getValue() !== null,
        };
    }

    create(participant: NewsCreateDto): void {
        this._actionState.set('loading');

        const command = new NewsCreateCommand(
            participant.firstName,
            participant.lastName,
            participant.email,
            participant.phone,
            participant.role
        );

        this.handleActionWithRefresh(
            this.createBus.dispatch(command),
            'COMMON.SUCCESS.CREATE'
        )
            .pipe(
                tap(() => {
                    this._actionSuccess.update((v) => v + 1);
                }),
                catchError((err) => {
                    this._actionError.set(err);
                    return throwError(() => err);
                }),
                finalize(() => this._actionState.set('idle'))
            )
            .subscribe();
    }

    update(participant: NewsUpdateDto): void {
        this._actionState.set('loading');
        const command = new NewsUpdateCommand(
            participant.uniqId,
            participant.firstName,
            participant.lastName,
            participant.email,
            participant.phone,
            participant.role
        );
        this.handleActionWithRefresh(
            this.updateBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        )
            .pipe(
                tap(() => {
                    this._actionSuccess.update((v) => v + 1);
                }),
                catchError((err) => {
                    this._actionError.set(err);
                    return throwError(() => err);
                }),
                finalize(() => this._actionState.set('idle'))
            )
            .subscribe();
    }

    enable(team: NewsEnableDto): void {
        const command = new NewsEnableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    disable(team: NewsDisableDto): void {
        const command = new NewsDisableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    delete(team: NewsDeleteDto): void {
        const command = new NewsDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
