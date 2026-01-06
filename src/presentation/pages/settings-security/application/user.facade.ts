/* import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { UsersStorePayloadEntity } from '../domain/entities/users/users-store-payload.entity';
import { UsersUpdatePayloadEntity } from '../domain/entities/users/users-update-payload.entity';
import { UsersEntity } from '../domain/entities/users/users.entity';
import {
    DeleteUserUseCase,
    DisableUserUseCase,
    EnableUserUseCase,
    FetchUsersUseCase,
    StoreUserUseCase,
    UpdateUserUseCase,
} from '../domain/use-cases/user.use-case';
import { UserFilter } from '../domain/value-objects/user-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class UserFacade extends BaseFacade<UsersEntity, UserFilter> {
    readonly users$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    constructor(
        private readonly fetchUsersUseCase: FetchUsersUseCase,
        private readonly storeUserUseCase: StoreUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
        private readonly enableUserUseCase: EnableUserUseCase,
        private readonly disableUserUseCase: DisableUserUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchUsers(
        filter: UserFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        forceRefresh: boolean = false
    ): void {
        if (!this.shouldFetch(forceRefresh)) {
            return;
        }

        const fetch$ = this.fetchUsersUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch$);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchUsersUseCase.execute(
            currentFilter,
            String(pageNumber)
        );
        this.changePageInternal(pageNumber, fetch$);

        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const currentPage = this.pageSubject.getValue();
        const fetch$ = this.fetchUsersUseCase.execute(
            currentFilter,
            currentPage
        );
        this.fetchData(currentFilter, currentPage, fetch$);

        this.lastFetchTimestamp = Date.now();
    }

    private shouldFetch(forceRefresh: boolean): boolean {
        if (forceRefresh) {
            return true;
        }
        if (!this.hasInitialized) {
            return true;
        }
        const isStale = Date.now() - this.lastFetchTimestamp > this.STALE_TIME;
        if (isStale) {
            return true;
        }
        const hasData = this.itemsSubject.getValue().length > 0;
        if (!hasData) {
            return true;
        }

        return false;
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
            hasData: this.itemsSubject.getValue().length > 0,
        };
    }

    storeUser(payload: UsersStorePayloadEntity): Observable<UsersEntity> {
        return this.storeUserUseCase.execute(payload).pipe(
            tap(() => {
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.USER.MESSAGES.SUCCESS.CREATED'
                );
                this.toastService.success(successMessage);
                this.refresh();
            })
        );
    }

    updateUser(payload: UsersUpdatePayloadEntity): Observable<UsersEntity> {
        return this.updateUserUseCase.execute(payload).pipe(
            tap(() => {
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.USER.MESSAGES.SUCCESS.UPDATED'
                );
                this.toastService.success(successMessage);
                this.refresh();
            })
        );
    }

    deleteUser(id: string): Observable<void> {
        return this.deleteUserUseCase.execute(id).pipe(
            tap(() => {
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.USER.MESSAGES.SUCCESS.DELETED'
                );
                this.toastService.success(successMessage);
                this.refresh();
            })
        );
    }

    enableUser(id: string): Observable<void> {
        return this.enableUserUseCase.execute(id).pipe(
            tap(() => {
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.USER.MESSAGES.SUCCESS.ENABLED'
                );
                this.toastService.success(successMessage);
                this.refresh();
            })
        );
    }

    disableUser(id: string): Observable<void> {
        return this.disableUserUseCase.execute(id).pipe(
            tap(() => {
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.USER.MESSAGES.SUCCESS.DISABLED'
                );
                this.toastService.success(successMessage);
                this.refresh();
            })
        );
    }
}
 */
