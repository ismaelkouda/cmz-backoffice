import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import { BaseFacade } from '@shared/application/services/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { TermsUseCreateCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-create.command';
import { TermsUseDeleteCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-delete.command';
import { TermsUsePublishCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-publish.command';
import { TermsUseUnpublishCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-unpublish.command';
import { TermsUseUpdateCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-update.command';
import { TermsUseCreateBus } from '@presentation/pages/content-management/application/commands-bus/terms-use/terms-use-create.bus';
import { TermsUseDeleteBus } from '@presentation/pages/content-management/application/commands-bus/terms-use/terms-use-delete.bus';
import { TermsUsePublishBus } from '@presentation/pages/content-management/application/commands-bus/terms-use/terms-use-publish.bus';
import { TermsUseUnpublishBus } from '@presentation/pages/content-management/application/commands-bus/terms-use/terms-use-unpublish.bus';
import { TermsUseUpdateBus } from '@presentation/pages/content-management/application/commands-bus/terms-use/terms-use-update.bus';
import { TermsUseCreateDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-create.dto';
import { TermsUseDeleteDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-delete.dto';
import { TermsUseFilterDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-filter.dto';
import { TermsUsePublishDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-publish.dto';
import { TermsUseUnpublishDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-unpublish.dto';
import { TermsUseUpdateDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-update.dto';
import { TermsUseQuery } from '@presentation/pages/content-management/application/queries/terms-use/terms-use.query';
import { TermsUseBus } from '@presentation/pages/content-management/application/queries-bus/terms-use/terms-use.bus';
import { TermsUseEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use.entity';

@Injectable({
    providedIn: 'root',
})
export class TermsUseFacade extends BaseFacade<
    TermsUseEntity,
    TermsUseFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(TermsUseBus);
    private readonly createBus = inject(TermsUseCreateBus);
    private readonly updateBus = inject(TermsUseUpdateBus);
    private readonly enableBus = inject(TermsUsePublishBus);
    private readonly disableBus = inject(TermsUseUnpublishBus);
    private readonly deleteBus = inject(TermsUseDeleteBus);

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
        filter: TermsUseFilterDto = {},
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

        const command = new TermsUseQuery(
            filter?.search,
            filter?.version,
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
        const command = new TermsUseQuery(
            filter?.search,
            filter?.version,
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
        const command = new TermsUseQuery(
            filter?.search,
            filter?.version,
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
        const command = new TermsUseQuery(
            filter?.search,
            filter?.version,
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

    create(dto: TermsUseCreateDto): void {
        this._actionState.set('loading');

        const command = new TermsUseCreateCommand(dto.version, dto.content);

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

    update(dto: TermsUseUpdateDto): void {
        this._actionState.set('loading');
        const command = new TermsUseUpdateCommand(
            dto.uniqId,
            dto.version,
            dto.content
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

    enable(team: TermsUsePublishDto): void {
        const command = new TermsUsePublishCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    disable(team: TermsUseUnpublishDto): void {
        const command = new TermsUseUnpublishCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    delete(team: TermsUseDeleteDto): void {
        const command = new TermsUseDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
