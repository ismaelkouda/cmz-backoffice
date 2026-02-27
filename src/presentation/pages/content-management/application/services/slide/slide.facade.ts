import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import { BaseFacade } from '@shared/application/services/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { SlideCreateCommand } from '@presentation/pages/content-management/application/commands/slide/slide-create.command';
import { SlideDeleteCommand } from '@presentation/pages/content-management/application/commands/slide/slide-delete.command';
import { SlidePublishCommand } from '@presentation/pages/content-management/application/commands/slide/slide-publish.command';
import { SlideUnpublishCommand } from '@presentation/pages/content-management/application/commands/slide/slide-unpublish.command';
import { SlideUpdateCommand } from '@presentation/pages/content-management/application/commands/slide/slide-update.command';
import { SlideCreateBus } from '@presentation/pages/content-management/application/commands-bus/slide/slide-create.bus';
import { SlideDeleteBus } from '@presentation/pages/content-management/application/commands-bus/slide/slide-delete.bus';
import { SlidePublishBus } from '@presentation/pages/content-management/application/commands-bus/slide/slide-publish.bus';
import { SlideUnpublishBus } from '@presentation/pages/content-management/application/commands-bus/slide/slide-unpublish.bus';
import { SlideUpdateBus } from '@presentation/pages/content-management/application/commands-bus/slide/slide-update.bus';
import { SlideCreateDto } from '@presentation/pages/content-management/application/dto/slide/slide-create.dto';
import { SlideDeleteDto } from '@presentation/pages/content-management/application/dto/slide/slide-delete.dto';
import { SlideFilterDto } from '@presentation/pages/content-management/application/dto/slide/slide-filter.dto';
import { SlidePublishDto } from '@presentation/pages/content-management/application/dto/slide/slide-publish.dto';
import { SlideUnpublishDto } from '@presentation/pages/content-management/application/dto/slide/slide-unpublish.dto';
import { SlideUpdateDto } from '@presentation/pages/content-management/application/dto/slide/slide-update.dto';
import { SlideQuery } from '@presentation/pages/content-management/application/queries/slide/slide.query';
import { SlideBus } from '@presentation/pages/content-management/application/queries-bus/slide/slide.bus';
import { SlideEntity } from '@presentation/pages/content-management/domain/entities/slide/slide.entity';

@Injectable({
    providedIn: 'root',
})
export class SlideFacade extends BaseFacade<SlideEntity, SlideFilterDto> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(SlideBus);
    private readonly createBus = inject(SlideCreateBus);
    private readonly updateBus = inject(SlideUpdateBus);
    private readonly enableBus = inject(SlidePublishBus);
    private readonly disableBus = inject(SlideUnpublishBus);
    private readonly deleteBus = inject(SlideDeleteBus);

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
        filter: SlideFilterDto = {},
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

        const command = new SlideQuery(
            filter?.search,
            filter?.platforms,
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
        const command = new SlideQuery(
            filter?.search,
            filter?.platforms,
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
        const command = new SlideQuery(
            filter?.search,
            filter?.platforms,
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
        const command = new SlideQuery(
            filter?.search,
            filter?.platforms,
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

    create(participant: SlideCreateDto): void {
        this._actionState.set('loading');

        const command = new SlideCreateCommand(
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

    update(participant: SlideUpdateDto): void {
        this._actionState.set('loading');
        const command = new SlideUpdateCommand(
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

    enable(team: SlidePublishDto): void {
        const command = new SlidePublishCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    disable(team: SlideUnpublishDto): void {
        const command = new SlideUnpublishCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    delete(team: SlideDeleteDto): void {
        const command = new SlideDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
