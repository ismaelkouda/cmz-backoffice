import { inject, Injectable, signal } from '@angular/core';
import { SiteGroupCreateCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-create.command';
import { SiteGroupDeleteCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-delete.command';
import { SiteGroupDisableCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-disable.command';
import { SiteGroupEnableCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-enable.command';
import { SiteGroupUpdateCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-update.command';
import { SiteGroupCreateBus } from '@pages/coverage-areas/application/commands-bus/site-group/site-group-create.bus';
import { SiteGroupDeleteBus } from '@pages/coverage-areas/application/commands-bus/site-group/site-group-delete.bus';
import { SiteGroupDisableBus } from '@pages/coverage-areas/application/commands-bus/site-group/site-group-disable.bus';
import { SiteGroupEnableBus } from '@pages/coverage-areas/application/commands-bus/site-group/site-group-enable.bus';
import { SiteGroupUpdateBus } from '@pages/coverage-areas/application/commands-bus/site-group/site-group-update.bus';
import { SiteGroupCreateDto } from '@pages/coverage-areas/application/dto/site-group/site-group-create.dto';
import { SiteGroupDeleteDto } from '@pages/coverage-areas/application/dto/site-group/site-group-delete.dto';
import { SiteGroupDisableDto } from '@pages/coverage-areas/application/dto/site-group/site-group-disable.dto';
import { SiteGroupEnableDto } from '@pages/coverage-areas/application/dto/site-group/site-group-enable.dto';
import { SiteGroupFilterDto } from '@pages/coverage-areas/application/dto/site-group/site-group-filter.dto';
import { SiteGroupUpdateDto } from '@pages/coverage-areas/application/dto/site-group/site-group-update.dto';
import { SiteGroupQuery } from '@pages/coverage-areas/application/queries/site-group/site-group.query';
import { SiteGroupBus } from '@pages/coverage-areas/application/queries-bus/site-group/site-group.bus';
import { SiteGroupEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class SiteGroupFacade extends BaseFacade<
    SiteGroupEntity,
    SiteGroupFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(SiteGroupBus);
    private readonly createBus = inject(SiteGroupCreateBus);
    private readonly updateBus = inject(SiteGroupUpdateBus);
    private readonly enableBus = inject(SiteGroupEnableBus);
    private readonly disableBus = inject(SiteGroupDisableBus);
    private readonly deleteBus = inject(SiteGroupDeleteBus);

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
            () => this.refresh()
        );
    }

    readAll(
        filter: SiteGroupFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        this.executeQuery(filter, page, options);
        this.hasInitialized = true;
    }

    refresh(): void {
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        this.executeQuery(null, this.pageSubject.getValue(), {
            forceRefresh: true,
        });
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        this.executeQuery(filter, page);
    }

    refreshWithLastFilterAndPage(): void {
        this.executeQuery(
            this.filterSubject.getValue(),
            this.pageSubject.getValue()
        );
    }

    private executeQuery(
        filter: SiteGroupFilterDto | null,
        page: string,
        options: FetchOptions = {}
    ): void {
        const query = this.buildQuery(filter);
        const fetch$ = this.filterBus.dispatch(query, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    private buildQuery(filter?: SiteGroupFilterDto | null): SiteGroupQuery {
        return new SiteGroupQuery(
            filter?.search,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
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

    create(dto: SiteGroupCreateDto): void {
        this._actionState.set('loading');

        const command = new SiteGroupCreateCommand(
            dto.code,
            dto.name,
            dto.description,
            dto.color
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

    update(dto: SiteGroupUpdateDto): void {
        this._actionState.set('loading');
        const command = new SiteGroupUpdateCommand(
            dto.uniqId,
            dto.code,
            dto.name,
            dto.description,
            dto.color
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

    enable(dto: SiteGroupEnableDto): void {
        const command = new SiteGroupEnableCommand(dto.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    disable(dto: SiteGroupDisableDto): void {
        const command = new SiteGroupDisableCommand(dto.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    delete(dto: SiteGroupDeleteDto): void {
        const command = new SiteGroupDeleteCommand(dto.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
