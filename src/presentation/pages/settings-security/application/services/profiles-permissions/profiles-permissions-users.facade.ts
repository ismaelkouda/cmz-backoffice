import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import { BaseFacade } from '@shared/application/services/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { ProfilesPermissionsUsersAssignCommand } from '@presentation/pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-assign.command';
import { ProfilesPermissionsUsersReassignCommand } from '@presentation/pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-reassign.command';
import { ProfilesPermissionsUsersRemoveCommand } from '@presentation/pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-remove.command';
import { ProfilesPermissionsUsersAssignBus } from '@presentation/pages/settings-security/application/commands-bus/profiles-permissions/profiles-permissions-users-assign.bus';
import { ProfilesPermissionsUsersReassignBus } from '@presentation/pages/settings-security/application/commands-bus/profiles-permissions/profiles-permissions-users-reassign.bus';
import { ProfilesPermissionsUsersRemoveBus } from '@presentation/pages/settings-security/application/commands-bus/profiles-permissions/profiles-permissions-users-remove.bus';
import { ProfilesPermissionsUsersAssignDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-users-assign.dto';
import { ProfilesPermissionsUsersFilterDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-users-filter.dto';
import { ProfilesPermissionsUsersReassignDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-users-reassign.dto';
import { ProfilesPermissionsUsersRemoveDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-users-remove.dto';
import { ProfilesPermissionsUsersQuery } from '@presentation/pages/settings-security/application/queries/profiles-permissions/profiles-permissions-users.query';
import { ProfilesPermissionsUsersBus } from '@presentation/pages/settings-security/application/queries-bus/profiles-permissions/profiles-permissions-users.bus';
import { ProfilesPermissionsUsersEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users.entity';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsUsersFacade extends BaseFacade<
    ProfilesPermissionsUsersEntity,
    ProfilesPermissionsUsersFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(ProfilesPermissionsUsersBus);
    private readonly reassignBus = inject(ProfilesPermissionsUsersReassignBus);
    private readonly assignBus = inject(ProfilesPermissionsUsersAssignBus);
    private readonly removeBus = inject(ProfilesPermissionsUsersRemoveBus);

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
        filter: ProfilesPermissionsUsersFilterDto,
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

        const command = new ProfilesPermissionsUsersQuery(
            filter.uniqId,
            filter?.search,
            filter?.userEmail,
            filter?.phone
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
        const command = new ProfilesPermissionsUsersQuery(
            filter?.uniqId ?? '',
            filter?.search,
            filter?.userEmail,
            filter?.phone
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
        const command = new ProfilesPermissionsUsersQuery(
            filter?.uniqId ?? '',
            filter?.search,
            filter?.userEmail,
            filter?.phone
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

    reassign(dto: ProfilesPermissionsUsersReassignDto): void {
        this._actionState.set('loading');
        const command = new ProfilesPermissionsUsersReassignCommand(
            dto.uniqId,
            dto.users.map((p) => p)
        );
        this.handleActionWithRefresh(
            this.reassignBus.dispatch(command),
            'COMMON.SUCCESS.REASSIGN'
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

    assign(dto: ProfilesPermissionsUsersAssignDto): void {
        this._actionState.set('loading');
        const command = new ProfilesPermissionsUsersAssignCommand(
            dto.uniqId,
            dto.users.map((p) => p)
        );
        this.handleActionWithRefresh(
            this.assignBus.dispatch(command),
            'COMMON.SUCCESS.ASSIGN'
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

    remove(dto: ProfilesPermissionsUsersRemoveDto): void {
        this._actionState.set('loading');
        const command = new ProfilesPermissionsUsersRemoveCommand(
            dto.uniqId,
            dto.users.map((p) => p)
        );
        this.handleActionWithRefresh(
            this.removeBus.dispatch(command),
            'COMMON.SUCCESS.REMOVE'
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
}
