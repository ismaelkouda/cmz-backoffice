import { inject, Injectable, signal } from '@angular/core';
import { InfrastructureTypeCreateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-create.command';
import { InfrastructureTypeDeleteCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-delete.command';
import { InfrastructureTypeDisableCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-disable.command';
import { InfrastructureTypeEnableCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-enable.command';
import { InfrastructureTypeUpdateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-update.command';
import { InfrastructureTypeCreateBus } from '@presentation/pages/administrative-infrastructure/application/commands-bus/infrastructure-type/infrastructure-type-create.bus';
import { InfrastructureTypeDeleteBus } from '@presentation/pages/administrative-infrastructure/application/commands-bus/infrastructure-type/infrastructure-type-delete.bus';
import { InfrastructureTypeDisableBus } from '@presentation/pages/administrative-infrastructure/application/commands-bus/infrastructure-type/infrastructure-type-disable.bus';
import { InfrastructureTypeEnableBus } from '@presentation/pages/administrative-infrastructure/application/commands-bus/infrastructure-type/infrastructure-type-enable.bus';
import { InfrastructureTypeUpdateBus } from '@presentation/pages/administrative-infrastructure/application/commands-bus/infrastructure-type/infrastructure-type-update.bus';
import { InfrastructureTypeCreateDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-create.dto';
import { InfrastructureTypeDeleteDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-delete.dto';
import { InfrastructureTypeDisableDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-disable.dto';
import { InfrastructureTypeEnableDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-enable.dto';
import { InfrastructureTypeFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-filter.dto';
import { InfrastructureTypeUpdateDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-update.dto';
import { InfrastructureTypeQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure-type/infrastructure-type.query';
import { InfrastructureTypeBus } from '@presentation/pages/administrative-infrastructure/application/queries-bus/infrastructure-type/infrastructure-type.bus';
import { InfrastructureTypeEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureTypeFacade extends BaseFacade<
    InfrastructureTypeEntity,
    InfrastructureTypeFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(InfrastructureTypeBus);
    private readonly createBus = inject(InfrastructureTypeCreateBus);
    private readonly updateBus = inject(InfrastructureTypeUpdateBus);
    private readonly enableBus = inject(InfrastructureTypeEnableBus);
    private readonly disableBus = inject(InfrastructureTypeDisableBus);
    private readonly deleteBus = inject(InfrastructureTypeDeleteBus);

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
        filter: InfrastructureTypeFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new InfrastructureTypeQuery(filter?.search);
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
        const command = new InfrastructureTypeQuery(filter?.search);
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
        const command = new InfrastructureTypeQuery(filter?.search);
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new InfrastructureTypeQuery(filter?.search);
        const fetch$ = this.filterBus.dispatch(command, page);
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

    create(user: any): void {
        this._actionState.set('loading');

        const command = new InfrastructureTypeCreateCommand(
            user.name,
            user.description
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

    update(user: any): void {
        this._actionState.set('loading');
        const command = new InfrastructureTypeUpdateCommand(
            user.uniqId,
            user.name,
            user.description
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

    enable(user: InfrastructureTypeEnableDto): void {
        const command = new InfrastructureTypeEnableCommand(user.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    disable(user: InfrastructureTypeDisableDto): void {
        const command = new InfrastructureTypeDisableCommand(user.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    delete(user: InfrastructureTypeDeleteDto): void {
        const command = new InfrastructureTypeDeleteCommand(user.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
