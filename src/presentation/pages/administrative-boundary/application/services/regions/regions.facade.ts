import { inject, Injectable, signal } from '@angular/core';
import { RegionsCreateCommand } from '@pages/administrative-boundary/application/commands/regions/regions-create.command';
import { RegionsDeleteCommand } from '@pages/administrative-boundary/application/commands/regions/regions-delete.command';
import { RegionsUpdateCommand } from '@pages/administrative-boundary/application/commands/regions/regions-update.command';
import { RegionsCreateBus } from '@pages/administrative-boundary/application/commands-bus/regions/regions-create.bus';
import { RegionsDeleteBus } from '@pages/administrative-boundary/application/commands-bus/regions/regions-delete.bus';
import { RegionsUpdateBus } from '@pages/administrative-boundary/application/commands-bus/regions/regions-update.bus';
import { RegionsCreateDto } from '@pages/administrative-boundary/application/dto/regions/regions-create.dto';
import { RegionsDeleteDto } from '@pages/administrative-boundary/application/dto/regions/regions-delete.dto';
import { RegionsFilterDto } from '@pages/administrative-boundary/application/dto/regions/regions-filter.dto';
import { RegionsUpdateDto } from '@pages/administrative-boundary/application/dto/regions/regions-update.dto';
import { RegionsQuery } from '@pages/administrative-boundary/application/queries/regions/regions.query';
import { RegionsBus } from '@pages/administrative-boundary/application/queries-bus/regions/regions.bus';
import { RegionsEntity } from '@pages/administrative-boundary/domain/entities/regions/regions.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class RegionsFacade extends BaseFacade<RegionsEntity, RegionsFilterDto> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(RegionsBus);
    private readonly createBus = inject(RegionsCreateBus);
    private readonly updateBus = inject(RegionsUpdateBus);
    private readonly deleteBus = inject(RegionsDeleteBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    readAll(
        filter: RegionsFilterDto,
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
            this.pageSubject.getValue(),
            {
                forceRefresh: true,
            }
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

    private executeQuery(
        filter: RegionsFilterDto | null,
        page: string,
        options?: FetchOptions
    ): void {
        const query = this.buildQueryFromFilter(filter);
        const fetch$ = this.filterBus.dispatch(query, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }
    private buildQueryFromFilter(
        filter: RegionsFilterDto | null
    ): RegionsQuery {
        return new RegionsQuery(
            filter?.search ?? null,
            filter?.startDate ?? null,
            filter?.endDate ?? null
        );
    }

    create(dto: RegionsCreateDto): void {
        const command = new RegionsCreateCommand(
            dto.code,
            dto.population,
            dto.infrastructure,
            dto.name,
            dto.description
        );
        this.executeAction(
            this.createBus.dispatch(command),
            'COMMON.SUCCESS.CREATE'
        ).subscribe();
    }

    update(dto: RegionsUpdateDto): void {
        const command = new RegionsUpdateCommand(
            dto.uniqId,
            dto.code,
            dto.population,
            dto.infrastructure,
            dto.name,
            dto.description
        );
        this.executeAction(
            this.updateBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    delete(dto: RegionsDeleteDto): void {
        const command = new RegionsDeleteCommand(dto.uniqId);
        this.executeAction(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE',
            false
        ).subscribe();
    }

    private executeAction<T>(
        observable: Observable<T>,
        successKey: string,
        trackState = true
    ): Observable<T> {
        if (trackState) {
            this._actionState.set('loading');
        }

        return handleObservableWithFeedback(
            observable,
            this.uiFeedback,
            successKey,
            () => this.refresh()
        ).pipe(
            tap(() => trackState && this._actionSuccess.update((v) => v + 1)),
            catchError((err) => {
                if (trackState) {
                    this._actionError.set(err);
                }
                return throwError(() => err);
            }),
            finalize(() => trackState && this._actionState.set('idle'))
        );
    }

    resetActionSuccess(): void {
        this._actionSuccess.set(0);
    }
}
