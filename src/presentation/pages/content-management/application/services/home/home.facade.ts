import { inject, Injectable, signal } from '@angular/core';
import { HomeCreateCommand } from '@pages/content-management/application/commands/home/home-create.command';
import { HomeDeleteCommand } from '@pages/content-management/application/commands/home/home-delete.command';
import { HomeDisableCommand } from '@pages/content-management/application/commands/home/home-disable.command';
import { HomeEnableCommand } from '@pages/content-management/application/commands/home/home-enable.command';
import { HomeUpdateCommand } from '@pages/content-management/application/commands/home/home-update.command';
import { HomeCreateBus } from '@pages/content-management/application/commands-bus/home/home-create.bus';
import { HomeDeleteBus } from '@pages/content-management/application/commands-bus/home/home-delete.bus';
import { HomeDisableBus } from '@pages/content-management/application/commands-bus/home/home-disable.bus';
import { HomeEnableBus } from '@pages/content-management/application/commands-bus/home/home-enable.bus';
import { HomeUpdateBus } from '@pages/content-management/application/commands-bus/home/home-update.bus';
import { HomeCreateDto } from '@pages/content-management/application/dto/home/home-create.dto';
import { HomeDeleteDto } from '@pages/content-management/application/dto/home/home-delete.dto';
import { HomeDisableDto } from '@pages/content-management/application/dto/home/home-disable.dto';
import { HomeEnableDto } from '@pages/content-management/application/dto/home/home-enable.dto';
import { HomeFilterDto } from '@pages/content-management/application/dto/home/home-filter.dto';
import { HomeUpdateDto } from '@pages/content-management/application/dto/home/home-update.dto';
import { HomeQuery } from '@pages/content-management/application/queries/home/home.query';
import { HomeBus } from '@pages/content-management/application/queries-bus/home/home.bus';
import { HomeEntity } from '@pages/content-management/domain/entities/home/home.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class HomeFacade extends BaseFacade<HomeEntity, HomeFilterDto> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(HomeBus);
    private readonly createBus = inject(HomeCreateBus);
    private readonly updateBus = inject(HomeUpdateBus);
    private readonly enableBus = inject(HomeEnableBus);
    private readonly disableBus = inject(HomeDisableBus);
    private readonly deleteBus = inject(HomeDeleteBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey: string
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedback,
            successKey,
            () => this.refreshWithLastFilterAndPage()
        );
    }

    readAll(
        filter: HomeFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new HomeQuery(
            filter?.search,
            filter?.platforms,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new HomeQuery(
            filter?.search,
            filter?.platforms,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(null, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        const command = new HomeQuery(
            filter?.search,
            filter?.platforms,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    private refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new HomeQuery(
            filter?.search,
            filter?.platforms,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
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

    create(home: HomeCreateDto): void {
        this._actionState.set('loading');

        const command = new HomeCreateCommand(
            home.image,
            home.platforms,
            home.startDate,
            home.endDate,
            home.title,
            home.resume,
            home.content,
            home.buttonLabel,
            home.buttonUrl
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

    update(home: HomeUpdateDto): void {
        this._actionState.set('loading');
        const command = new HomeUpdateCommand(
            home.uniqId,
            home.image,
            home.platforms,
            home.startDate,
            home.endDate,
            home.title,
            home.resume,
            home.content,
            home.buttonLabel,
            home.buttonUrl
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

    enable(team: HomeEnableDto): void {
        const command = new HomeEnableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.ENABLE'
        ).subscribe();
    }

    disable(team: HomeDisableDto): void {
        const command = new HomeDisableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.DISABLE'
        ).subscribe();
    }

    delete(team: HomeDeleteDto): void {
        const command = new HomeDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
