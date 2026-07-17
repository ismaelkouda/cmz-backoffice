import { inject, Injectable, signal } from '@angular/core';
import { MobileNetworkCreateCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-create.command';
import { MobileNetworkDeleteCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-delete.command';
import { MobileNetworkDisableCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-disable.command';
import { MobileNetworkEnableCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-enable.command';
import { MobileNetworkUpdateCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-update.command';
import { MobileNetworkCreateBus } from '@pages/coverage-areas/application/commands-bus/mobile-network/mobile-network-create.bus';
import { MobileNetworkDeleteBus } from '@pages/coverage-areas/application/commands-bus/mobile-network/mobile-network-delete.bus';
import { MobileNetworkDisableBus } from '@pages/coverage-areas/application/commands-bus/mobile-network/mobile-network-disable.bus';
import { MobileNetworkEnableBus } from '@pages/coverage-areas/application/commands-bus/mobile-network/mobile-network-enable.bus';
import { MobileNetworkUpdateBus } from '@pages/coverage-areas/application/commands-bus/mobile-network/mobile-network-update.bus';
import { MobileNetworkCreateDto } from '@pages/coverage-areas/application/dto/mobile-network/mobile-network-create.dto';
import { MobileNetworkDeleteDto } from '@pages/coverage-areas/application/dto/mobile-network/mobile-network-delete.dto';
import { MobileNetworkDisableDto } from '@pages/coverage-areas/application/dto/mobile-network/mobile-network-disable.dto';
import { MobileNetworkEnableDto } from '@pages/coverage-areas/application/dto/mobile-network/mobile-network-enable.dto';
import { MobileNetworkFilterDto } from '@pages/coverage-areas/application/dto/mobile-network/mobile-network-filter.dto';
import { MobileNetworkUpdateDto } from '@pages/coverage-areas/application/dto/mobile-network/mobile-network-update.dto';
import { MobileNetworkQuery } from '@pages/coverage-areas/application/queries/mobile-network/mobile-network.query';
import { MobileNetworkBus } from '@pages/coverage-areas/application/queries-bus/mobile-network/mobile-network.bus';
import { MobileNetworkEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class MobileNetworkFacade extends BaseFacade<
    MobileNetworkEntity,
    MobileNetworkFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(MobileNetworkBus);
    private readonly createBus = inject(MobileNetworkCreateBus);
    private readonly updateBus = inject(MobileNetworkUpdateBus);
    private readonly enableBus = inject(MobileNetworkEnableBus);
    private readonly disableBus = inject(MobileNetworkDisableBus);
    private readonly deleteBus = inject(MobileNetworkDeleteBus);

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
        filter: MobileNetworkFilterDto = {},
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
        filter: MobileNetworkFilterDto | null,
        page: string,
        options: FetchOptions = {}
    ): void {
        const query = this.buildQuery(filter);
        const fetch$ = this.filterBus.dispatch(query, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    private buildQuery(
        filter?: MobileNetworkFilterDto | null
    ): MobileNetworkQuery {
        return new MobileNetworkQuery(
            filter?.search,
            filter?.towerTypeId,
            filter?.towerSize,
            filter?.technology,
            filter?.operator,
            filter?.radius,
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

    create(dto: MobileNetworkCreateDto): void {
        this._actionState.set('loading');

        const command = new MobileNetworkCreateCommand(
            dto.siteId,
            dto.siteName,
            dto.towerTypeId,
            dto.towerSize,
            dto.technology,
            dto.operator,
            dto.radius
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

    update(dto: MobileNetworkUpdateDto): void {
        this._actionState.set('loading');
        const command = new MobileNetworkUpdateCommand(
            dto.uniqId,
            dto.siteId,
            dto.siteName,
            dto.towerTypeId,
            dto.towerSize,
            dto.technology,
            dto.operator,
            dto.radius
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

    enable(dto: MobileNetworkEnableDto): void {
        const command = new MobileNetworkEnableCommand(dto.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    disable(dto: MobileNetworkDisableDto): void {
        const command = new MobileNetworkDisableCommand(dto.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    delete(dto: MobileNetworkDeleteDto): void {
        const command = new MobileNetworkDeleteCommand(dto.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
