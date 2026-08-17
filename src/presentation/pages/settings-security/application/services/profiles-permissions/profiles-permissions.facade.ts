import { inject, Injectable, signal } from '@angular/core';
import { ProfilesPermissionsCreateCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-create.command';
import { ProfilesPermissionsDeleteCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-delete.command';
import { ProfilesPermissionsDisableCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-disable.command';
import { ProfilesPermissionsEnableCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-enable.command';
import { ProfilesPermissionsUpdateCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-update.command';
import { ProfilesPermissionsCreateBus } from '@pages/settings-security/application/commands-bus/profiles-permissions/profiles-permissions-create.bus';
import { ProfilesPermissionsDeleteBus } from '@pages/settings-security/application/commands-bus/profiles-permissions/profiles-permissions-delete.bus';
import { ProfilesPermissionsDisableBus } from '@pages/settings-security/application/commands-bus/profiles-permissions/profiles-permissions-disable.bus';
import { ProfilesPermissionsEnableBus } from '@pages/settings-security/application/commands-bus/profiles-permissions/profiles-permissions-enable.bus';
import { ProfilesPermissionsUpdateBus } from '@pages/settings-security/application/commands-bus/profiles-permissions/profiles-permissions-update.bus';
import { ProfilesPermissionsCreateDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-create.dto';
import { ProfilesPermissionsDeleteDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-delete.dto';
import { ProfilesPermissionsDisableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-disable.dto';
import { ProfilesPermissionsEnableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-enable.dto';
import { ProfilesPermissionsFilterDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-filter.dto';
import { ProfilesPermissionsUpdateDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-update.dto';
import { ProfilesPermissionsQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions.query';
import { ProfilesPermissionsBus } from '@pages/settings-security/application/queries-bus/profiles-permissions/profiles-permissions.bus';
import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsFacade extends BaseFacade<
    ProfilesPermissionsEntity,
    ProfilesPermissionsFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(ProfilesPermissionsBus);
    private readonly createBus = inject(ProfilesPermissionsCreateBus);
    private readonly updateBus = inject(ProfilesPermissionsUpdateBus);
    private readonly enableBus = inject(ProfilesPermissionsEnableBus);
    private readonly disableBus = inject(ProfilesPermissionsDisableBus);
    private readonly deleteBus = inject(ProfilesPermissionsDeleteBus);

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
        filter: ProfilesPermissionsFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new ProfilesPermissionsQuery(
            filter?.search,
            filter?.user,
            filter?.status
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
        const command = new ProfilesPermissionsQuery(
            filter?.search,
            filter?.user,
            filter?.status
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
        const command = new ProfilesPermissionsQuery(
            filter?.search,
            filter?.user,
            filter?.status
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new ProfilesPermissionsQuery(
            filter?.search,
            filter?.user,
            filter?.status
        );
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

    create(team: ProfilesPermissionsCreateDto): void {
        this._actionState.set('loading');

        const command = new ProfilesPermissionsCreateCommand(
            team.name,
            team.description,
            team.permissions
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

    update(team: ProfilesPermissionsUpdateDto): void {
        this._actionState.set('loading');

        const command = new ProfilesPermissionsUpdateCommand(
            team.uniqId,
            team.name,
            team.description,
            team.permissions
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

    enable(team: ProfilesPermissionsEnableDto): void {
        const command = new ProfilesPermissionsEnableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    disable(team: ProfilesPermissionsDisableDto): void {
        const command = new ProfilesPermissionsDisableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    delete(team: ProfilesPermissionsDeleteDto): void {
        const command = new ProfilesPermissionsDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
