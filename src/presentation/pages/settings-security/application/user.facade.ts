import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION_CONST } from '@presentation/pages/settings-security/domain/constants/pagination.constants';
import { BaseFacade } from '@shared/application/base/base-facade';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, tap } from 'rxjs';
import {
    UserStoreRequestDto,
    UserUpdateRequestDto,
} from '../data/dtos/user-response.dto';
import { User } from '../domain/entities/user.entity';
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
export class UserFacade extends BaseFacade<User, UserFilter> {
    readonly users$ = this.items$;

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
        page: string = PAGINATION_CONST.DEFAULT_PAGE
    ): void {
        const fetch$ = this.fetchUsersUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch$);
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
    }

    storeUser(payload: UserStoreRequestDto): Observable<User> {
        return this.storeUserUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.USER.MESSAGES.SUCCESS.CREATED'
                );
                this.toastService.success(successMessage);
            })
        );
    }

    updateUser(payload: UserUpdateRequestDto): Observable<User> {
        return this.updateUserUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.USER.MESSAGES.SUCCESS.UPDATED'
                );
                this.toastService.success(successMessage);
            })
        );
    }

    deleteUser(id: string): Observable<void> {
        return this.deleteUserUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.USER.MESSAGES.SUCCESS.DELETED'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    enableUser(id: string): Observable<void> {
        return this.enableUserUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.USER.MESSAGES.SUCCESS.ENABLED'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    disableUser(id: string): Observable<void> {
        return this.disableUserUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.USER.MESSAGES.SUCCESS.DISABLED'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }
}
