import { inject, Injectable, signal } from '@angular/core';
import { OpticalFiberNetworkCreateCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-create.command';
import { OpticalFiberNetworkDeleteCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-delete.command';
import { OpticalFiberNetworkDisableCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-disable.command';
import { OpticalFiberNetworkEnableCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-enable.command';
import { OpticalFiberNetworkUpdateCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-update.command';
import { OpticalFiberNetworkCreateBus } from '@pages/coverage-areas/application/commands-bus/optical-fiber-network/optical-fiber-network-create.bus';
import { OpticalFiberNetworkDeleteBus } from '@pages/coverage-areas/application/commands-bus/optical-fiber-network/optical-fiber-network-delete.bus';
import { OpticalFiberNetworkDisableBus } from '@pages/coverage-areas/application/commands-bus/optical-fiber-network/optical-fiber-network-disable.bus';
import { OpticalFiberNetworkEnableBus } from '@pages/coverage-areas/application/commands-bus/optical-fiber-network/optical-fiber-network-enable.bus';
import { OpticalFiberNetworkUpdateBus } from '@pages/coverage-areas/application/commands-bus/optical-fiber-network/optical-fiber-network-update.bus';
import { OpticalFiberNetworkCreateDto } from '@pages/coverage-areas/application/dto/optical-fiber-network/optical-fiber-network-create.dto';
import { OpticalFiberNetworkDeleteDto } from '@pages/coverage-areas/application/dto/optical-fiber-network/optical-fiber-network-delete.dto';
import { OpticalFiberNetworkDisableDto } from '@pages/coverage-areas/application/dto/optical-fiber-network/optical-fiber-network-disable.dto';
import { OpticalFiberNetworkEnableDto } from '@pages/coverage-areas/application/dto/optical-fiber-network/optical-fiber-network-enable.dto';
import { OpticalFiberNetworkFilterDto } from '@pages/coverage-areas/application/dto/optical-fiber-network/optical-fiber-network-filter.dto';
import { OpticalFiberNetworkUpdateDto } from '@pages/coverage-areas/application/dto/optical-fiber-network/optical-fiber-network-update.dto';
import { OpticalFiberNetworkQuery } from '@pages/coverage-areas/application/queries/optical-fiber-network/optical-fiber-network.query';
import { OpticalFiberNetworkBus } from '@pages/coverage-areas/application/queries-bus/optical-fiber-network/optical-fiber-network.bus';
import { OpticalFiberNetworkEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class OpticalFiberNetworkFacade extends BaseFacade<
    OpticalFiberNetworkEntity,
    OpticalFiberNetworkFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(OpticalFiberNetworkBus);
    private readonly createBus = inject(OpticalFiberNetworkCreateBus);
    private readonly updateBus = inject(OpticalFiberNetworkUpdateBus);
    private readonly enableBus = inject(OpticalFiberNetworkEnableBus);
    private readonly disableBus = inject(OpticalFiberNetworkDisableBus);
    private readonly deleteBus = inject(OpticalFiberNetworkDeleteBus);

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
        filter: OpticalFiberNetworkFilterDto = {},
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
        filter: OpticalFiberNetworkFilterDto | null,
        page: string,
        options: FetchOptions = {}
    ): void {
        const query = this.buildQuery(filter);
        const fetch$ = this.filterBus.dispatch(query, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    private buildQuery(
        filter?: OpticalFiberNetworkFilterDto | null
    ): OpticalFiberNetworkQuery {
        return new OpticalFiberNetworkQuery(
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

    create(dto: OpticalFiberNetworkCreateDto): void {
        this._actionState.set('loading');

        const command = new OpticalFiberNetworkCreateCommand(
            dto.name,
            dto.operator,
            dto.fiberConstructorId,
            dto.type,
            dto.geomFile
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

    update(dto: OpticalFiberNetworkUpdateDto): void {
        this._actionState.set('loading');
        const command = new OpticalFiberNetworkUpdateCommand(
            dto.uniqId,
            dto.name,
            dto.operator,
            dto.fiberConstructorId,
            dto.type,
            dto.geomFile
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

    enable(dto: OpticalFiberNetworkEnableDto): void {
        const command = new OpticalFiberNetworkEnableCommand(dto.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    disable(dto: OpticalFiberNetworkDisableDto): void {
        const command = new OpticalFiberNetworkDisableCommand(dto.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    delete(dto: OpticalFiberNetworkDeleteDto): void {
        const command = new OpticalFiberNetworkDeleteCommand(dto.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
