import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import { BaseFacade } from '@shared/application/services/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { UsersCreateCommand } from '@presentation/pages/settings-security/application/commands/users/users-create.command';
import { UsersDeleteCommand } from '@presentation/pages/settings-security/application/commands/users/users-delete.command';
import { UsersDisableCommand } from '@presentation/pages/settings-security/application/commands/users/users-disable.command';
import { UsersEnableCommand } from '@presentation/pages/settings-security/application/commands/users/users-enable.command';
import { UsersUpdateCommand } from '@presentation/pages/settings-security/application/commands/users/users-update.command';
import { UsersCreateBus } from '@presentation/pages/settings-security/application/commands-bus/users/users-create.bus';
import { UsersDeleteBus } from '@presentation/pages/settings-security/application/commands-bus/users/users-delete.bus';
import { UsersDisableBus } from '@presentation/pages/settings-security/application/commands-bus/users/users-disable.bus';
import { UsersEnableBus } from '@presentation/pages/settings-security/application/commands-bus/users/users-enable.bus';
import { UsersUpdateBus } from '@presentation/pages/settings-security/application/commands-bus/users/users-update.bus';
import { UsersCreateDto } from '@presentation/pages/settings-security/application/dto/users/users-create.dto';
import { UsersDeleteDto } from '@presentation/pages/settings-security/application/dto/users/users-delete.dto';
import { UsersDisableDto } from '@presentation/pages/settings-security/application/dto/users/users-disable.dto';
import { UsersEnableDto } from '@presentation/pages/settings-security/application/dto/users/users-enable.dto';
import { UsersFilterDto } from '@presentation/pages/settings-security/application/dto/users/users-filter.dto';
import { UsersUpdateDto } from '@presentation/pages/settings-security/application/dto/users/users-update.dto';
import { UsersQuery } from '@presentation/pages/settings-security/application/queries/users/users.query';
import { UsersBus } from '@presentation/pages/settings-security/application/queries-bus/users/users.bus';
import { UsersEntity } from '@presentation/pages/settings-security/domain/entities/users/users.entity';

@Injectable({
    providedIn: 'root',
})
export class UsersFacade extends BaseFacade<UsersEntity, UsersFilterDto> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(UsersBus);
    private readonly createBus = inject(UsersCreateBus);
    private readonly updateBus = inject(UsersUpdateBus);
    private readonly enableBus = inject(UsersEnableBus);
    private readonly disableBus = inject(UsersDisableBus);
    private readonly deleteBus = inject(UsersDeleteBus);

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
        filter: UsersFilterDto = {},
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

        const command = new UsersQuery(
            filter?.search,
            filter?.profile,
            filter?.responsibility,
            filter?.isActive
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
        const command = new UsersQuery(
            filter?.search,
            filter?.profile,
            filter?.responsibility,
            filter?.isActive
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
        const command = new UsersQuery(
            filter?.search,
            filter?.profile,
            filter?.responsibility,
            filter?.isActive
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
        const command = new UsersQuery(
            filter?.search,
            filter?.profile,
            filter?.responsibility,
            filter?.isActive
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

    create(participant: UsersCreateDto): void {
        this._actionState.set('loading');

        const command = new UsersCreateCommand(
            participant.firstName,
            participant.lastName,
            participant.email,
            participant.phone,
            participant.profile,
            participant.responsibility
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

    update(participant: UsersUpdateDto): void {
        this._actionState.set('loading');
        const command = new UsersUpdateCommand(
            participant.uniqId,
            participant.firstName,
            participant.lastName,
            participant.email,
            participant.phone,
            participant.profile,
            participant.responsibility
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

    enable(user: UsersEnableDto): void {
        const command = new UsersEnableCommand(user.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    disable(user: UsersDisableDto): void {
        const command = new UsersDisableCommand(user.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    delete(user: UsersDeleteDto): void {
        const command = new UsersDeleteCommand(user.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        );
    }
}
