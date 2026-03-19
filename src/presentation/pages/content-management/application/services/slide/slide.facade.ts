import { inject, Injectable, signal } from '@angular/core';
import { SlideCreateCommand } from '@pages/content-management/application/commands/slide/slide-create.command';
import { SlideDeleteCommand } from '@pages/content-management/application/commands/slide/slide-delete.command';
import { SlideUpdateCommand } from '@pages/content-management/application/commands/slide/slide-update.command';
import { SlideCreateBus } from '@pages/content-management/application/commands-bus/slide/slide-create.bus';
import { SlideDeleteBus } from '@pages/content-management/application/commands-bus/slide/slide-delete.bus';
import { SlideUpdateBus } from '@pages/content-management/application/commands-bus/slide/slide-update.bus';
import { SlideCreateDto } from '@pages/content-management/application/dto/slide/slide-create.dto';
import { SlideDeleteDto } from '@pages/content-management/application/dto/slide/slide-delete.dto';
import { SlideFilterDto } from '@pages/content-management/application/dto/slide/slide-filter.dto';
import { SlideUpdateDto } from '@pages/content-management/application/dto/slide/slide-update.dto';
import { SlideQuery } from '@pages/content-management/application/queries/slide/slide.query';
import { SlideBus } from '@pages/content-management/application/queries-bus/slide/slide.bus';
import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import { SlideDisableCommand } from '@presentation/pages/content-management/application/commands/slide/slide-disable.command';
import { SlideEnableCommand } from '@presentation/pages/content-management/application/commands/slide/slide-enable.command';
import { SlideDisableBus } from '@presentation/pages/content-management/application/commands-bus/slide/slide-disable.bus';
import { SlideEnableBus } from '@presentation/pages/content-management/application/commands-bus/slide/slide-enable.bus';
import { SlideDisableDto } from '@presentation/pages/content-management/application/dto/slide/slide-disable.dto';
import { SlideEnableDto } from '@presentation/pages/content-management/application/dto/slide/slide-enable.dto';
import { BaseFacade } from '@shared/application/services/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SlideFacade extends BaseFacade<SlideEntity, SlideFilterDto> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(SlideBus);
    private readonly createBus = inject(SlideCreateBus);
    private readonly updateBus = inject(SlideUpdateBus);
    private readonly enableBus = inject(SlideEnableBus);
    private readonly disableBus = inject(SlideDisableBus);
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
            () => this.refreshWithLastFilterAndPage()
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

    private refreshWithLastFilterAndPage(): void {
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

    create(slide: SlideCreateDto): void {
        this._actionState.set('loading');

        const command = new SlideCreateCommand(
            slide.timeDuration,
            slide.type,
            slide.image,
            slide.video,
            slide.platforms,
            slide.startDate,
            slide.endDate,
            slide.title,
            slide.subtitle,
            slide.content,
            slide.buttonLabel,
            slide.buttonUrl
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

    update(slide: SlideUpdateDto): void {
        this._actionState.set('loading');
        const command = new SlideUpdateCommand(
            slide.uniqId,
            slide.timeDuration,
            slide.type,
            slide.image,
            slide.video,
            slide.platforms,
            slide.startDate,
            slide.endDate,
            slide.title,
            slide.subtitle,
            slide.content,
            slide.buttonLabel,
            slide.buttonUrl
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

    enable(team: SlideEnableDto): void {
        const command = new SlideEnableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    disable(team: SlideDisableDto): void {
        const command = new SlideDisableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    delete(team: SlideDeleteDto): void {
        const command = new SlideDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
