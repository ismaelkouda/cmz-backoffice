import { inject, Injectable, signal } from '@angular/core';
import { RadioRelayLinksCreateCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-create.command';
import { RadioRelayLinksDeleteCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-delete.command';
import { RadioRelayLinksDisableCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-disable.command';
import { RadioRelayLinksEnableCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-enable.command';
import { RadioRelayLinksUpdateCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-update.command';
import { RadioRelayLinksCreateBus } from '@pages/coverage-areas/application/commands-bus/radio-relay-links/radio-relay-links-create.bus';
import { RadioRelayLinksDeleteBus } from '@pages/coverage-areas/application/commands-bus/radio-relay-links/radio-relay-links-delete.bus';
import { RadioRelayLinksDisableBus } from '@pages/coverage-areas/application/commands-bus/radio-relay-links/radio-relay-links-disable.bus';
import { RadioRelayLinksEnableBus } from '@pages/coverage-areas/application/commands-bus/radio-relay-links/radio-relay-links-enable.bus';
import { RadioRelayLinksUpdateBus } from '@pages/coverage-areas/application/commands-bus/radio-relay-links/radio-relay-links-update.bus';
import { RadioRelayLinksCreateDto } from '@pages/coverage-areas/application/dto/radio-relay-links/radio-relay-links-create.dto';
import { RadioRelayLinksDeleteDto } from '@pages/coverage-areas/application/dto/radio-relay-links/radio-relay-links-delete.dto';
import { RadioRelayLinksDisableDto } from '@pages/coverage-areas/application/dto/radio-relay-links/radio-relay-links-disable.dto';
import { RadioRelayLinksEnableDto } from '@pages/coverage-areas/application/dto/radio-relay-links/radio-relay-links-enable.dto';
import { RadioRelayLinksFilterDto } from '@pages/coverage-areas/application/dto/radio-relay-links/radio-relay-links-filter.dto';
import { RadioRelayLinksUpdateDto } from '@pages/coverage-areas/application/dto/radio-relay-links/radio-relay-links-update.dto';
import { RadioRelayLinksQuery } from '@pages/coverage-areas/application/queries/radio-relay-links/radio-relay-links.query';
import { RadioRelayLinksBus } from '@pages/coverage-areas/application/queries-bus/radio-relay-links/radio-relay-links.bus';
import { RadioRelayLinksEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class RadioRelayLinksFacade extends BaseFacade<
    RadioRelayLinksEntity,
    RadioRelayLinksFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(RadioRelayLinksBus);
    private readonly createBus = inject(RadioRelayLinksCreateBus);
    private readonly updateBus = inject(RadioRelayLinksUpdateBus);
    private readonly enableBus = inject(RadioRelayLinksEnableBus);
    private readonly disableBus = inject(RadioRelayLinksDisableBus);
    private readonly deleteBus = inject(RadioRelayLinksDeleteBus);

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
        filter: RadioRelayLinksFilterDto = {},
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
        filter: RadioRelayLinksFilterDto | null,
        page: string,
        options: FetchOptions = {}
    ): void {
        const query = this.buildQuery(filter);
        const fetch$ = this.filterBus.dispatch(query, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    private buildQuery(
        filter?: RadioRelayLinksFilterDto | null
    ): RadioRelayLinksQuery {
        return new RadioRelayLinksQuery(
            filter?.search,
            filter?.operator,
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

    create(dto: RadioRelayLinksCreateDto): void {
        this._actionState.set('loading');

        const command = new RadioRelayLinksCreateCommand(
            dto.name,
            dto.operator,
            dto.frequency,
            dto.startDate,
            dto.endDate
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

    update(dto: RadioRelayLinksUpdateDto): void {
        this._actionState.set('loading');
        const command = new RadioRelayLinksUpdateCommand(
            dto.uniqId,
            dto.name,
            dto.operator,
            dto.frequency,
            dto.startDate,
            dto.endDate
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

    enable(dto: RadioRelayLinksEnableDto): void {
        const command = new RadioRelayLinksEnableCommand(dto.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    disable(dto: RadioRelayLinksDisableDto): void {
        const command = new RadioRelayLinksDisableCommand(dto.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    delete(dto: RadioRelayLinksDeleteDto): void {
        const command = new RadioRelayLinksDeleteCommand(dto.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
