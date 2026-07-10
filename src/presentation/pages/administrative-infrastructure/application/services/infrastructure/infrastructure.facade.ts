import { inject, Injectable, signal } from '@angular/core';
import { InfrastructureCreateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-create.command';
import { InfrastructureDeleteCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-delete.command';
import { InfrastructureUpdateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-update.command';
import { InfrastructureCreateBus } from '@presentation/pages/administrative-infrastructure/application/commands-bus/infrastructure/infrastructure-create.bus';
import { InfrastructureDeleteBus } from '@presentation/pages/administrative-infrastructure/application/commands-bus/infrastructure/infrastructure-delete.bus';
import { InfrastructureUpdateBus } from '@presentation/pages/administrative-infrastructure/application/commands-bus/infrastructure/infrastructure-update.bus';
import { InfrastructureCreateDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-create.dto';
import { InfrastructureDeleteDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-delete.dto';
import { InfrastructureFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-filter.dto';
import { InfrastructureUpdateDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-update.dto';
import { InfrastructureQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure/infrastructure.query';
import { InfrastructureBus } from '@presentation/pages/administrative-infrastructure/application/queries-bus/infrastructure/infrastructure.bus';
import { InfrastructureEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureFacade extends BaseFacade<
    InfrastructureEntity,
    InfrastructureFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(InfrastructureBus);
    private readonly createBus = inject(InfrastructureCreateBus);
    private readonly updateBus = inject(InfrastructureUpdateBus);
    private readonly deleteBus = inject(InfrastructureDeleteBus);

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
        filter: InfrastructureFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new InfrastructureQuery(filter?.search);
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
        const command = new InfrastructureQuery(filter?.search);
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
        const command = new InfrastructureQuery(filter?.search);
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new InfrastructureQuery(filter?.search);
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

        const command = new InfrastructureCreateCommand(
            user.name,
            user.type,
            user.description,
            user.region,
            user.region,
            user.department,
            user.municipality
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
        const command = new InfrastructureUpdateCommand(
            user.uniqId,
            user.name,
            user.type,
            user.description,
            user.region,
            user.region,
            user.department,
            user.municipality
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

    delete(user: InfrastructureDeleteDto): void {
        const command = new InfrastructureDeleteCommand(user.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
