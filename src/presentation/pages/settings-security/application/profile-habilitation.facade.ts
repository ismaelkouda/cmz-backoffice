import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION_CONST } from '@presentation/pages/settings-security/domain/constants/pagination.constants';
import { BaseFacade } from '@shared/application/base/base-facade';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, tap } from 'rxjs';
import {
    AffectedRequestDto,
    ProfileHabilitationStoreRequestDto,
    ProfileHabilitationUpdateRequestDto,
    ProfileWithoutUserDto,
    ReassignRequestDto,
    RemoveRequestDto,
} from '../data/dtos/profile-habilitation-response.dto';
import { ProfileHabilitation } from '../domain/entities/profile-habilitation.entity';
import { User } from '../domain/entities/user.entity';
import {
    AffectedUsersUseCase,
    DeleteProfileHabilitationUseCase,
    DisableProfileHabilitationUseCase,
    EnableProfileHabilitationUseCase,
    FetchProfileHabilitationUseCase,
    GetProfilesWithoutUserUseCase,
    GetUsersByProfileUseCase,
    GetUsersWithoutProfileUseCase,
    ReassignUsersUseCase,
    RemoveUsersUseCase,
    StoreProfileHabilitationUseCase,
    UpdateProfileHabilitationUseCase,
} from '../domain/use-cases/profile-habilitation.use-case';
import { ProfileHabilitationFilter } from '../domain/value-objects/profile-habilitation-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class ProfileHabilitationFacade extends BaseFacade<
    ProfileHabilitation,
    ProfileHabilitationFilter
> {
    readonly profileHabilitation$ = this.items$;

    constructor(
        private readonly fetchProfileHabilitationUseCase: FetchProfileHabilitationUseCase,
        private readonly storeProfileHabilitationUseCase: StoreProfileHabilitationUseCase,
        private readonly updateProfileHabilitationUseCase: UpdateProfileHabilitationUseCase,
        private readonly deleteProfileHabilitationUseCase: DeleteProfileHabilitationUseCase,
        private readonly enableProfileHabilitationUseCase: EnableProfileHabilitationUseCase,
        private readonly disableProfileHabilitationUseCase: DisableProfileHabilitationUseCase,
        private readonly getProfilesWithoutUserUseCase: GetProfilesWithoutUserUseCase,
        private readonly reassignUsersUseCase: ReassignUsersUseCase,
        private readonly removeUsersUseCase: RemoveUsersUseCase,
        private readonly assignUsersUseCase: AffectedUsersUseCase,
        private readonly getUsersByProfileUseCase: GetUsersByProfileUseCase,
        private readonly getUsersWithoutProfileUseCase: GetUsersWithoutProfileUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchProfileHabilitation(
        filter: ProfileHabilitationFilter = ProfileHabilitationFilter.create(),
        page: string = PAGINATION_CONST.DEFAULT_PAGE
    ): void {
        const fetch$ = this.fetchProfileHabilitationUseCase.execute(
            filter,
            page
        );
        this.fetchData(filter, page, fetch$);
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchProfileHabilitationUseCase.execute(
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
        const fetch$ = this.fetchProfileHabilitationUseCase.execute(
            currentFilter,
            currentPage
        );
        this.fetchData(currentFilter, currentPage, fetch$);
    }

    storeProfileHabilitation(
        payload: ProfileHabilitationStoreRequestDto
    ): Observable<ProfileHabilitation> {
        return this.storeProfileHabilitationUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.MESSAGES.SUCCESS.CREATED'
                );
                this.toastService.success(successMessage);
            }),
            map((profileHabilitation) => profileHabilitation)
        );
    }

    updateProfileHabilitation(
        payload: ProfileHabilitationUpdateRequestDto
    ): Observable<ProfileHabilitation> {
        return this.updateProfileHabilitationUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.MESSAGES.SUCCESS.UPDATED'
                );
                this.toastService.success(successMessage);
            }),
            map((profileHabilitation) => profileHabilitation)
        );
    }

    deleteProfileHabilitation(id: string): Observable<void> {
        return this.deleteProfileHabilitationUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.MESSAGES.SUCCESS.DELETED'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    enableProfileHabilitation(id: string): Observable<void> {
        return this.enableProfileHabilitationUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.MESSAGES.SUCCESS.ENABLED'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    disableProfileHabilitation(id: string): Observable<void> {
        return this.disableProfileHabilitationUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.MESSAGES.SUCCESS.DISABLED'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    getProfilesWithoutUser(
        profileId?: string
    ): Observable<ProfileWithoutUserDto[]> {
        return this.getProfilesWithoutUserUseCase.execute(profileId);
    }

    reassignUsers(payload: ReassignRequestDto): Observable<void> {
        return this.reassignUsersUseCase.execute(payload).pipe(
            tap(() => {
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.MESSAGES.SUCCESS.REASSIGNED'
                );
                this.toastService.success(successMessage);
            })
        );
    }

    removeUsers(payload: RemoveRequestDto): Observable<void> {
        return this.removeUsersUseCase.execute(payload).pipe(
            tap(() => {
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.MESSAGES.SUCCESS.RETIRED'
                );
                this.toastService.success(successMessage);
            })
        );
    }

    assignUsers(payload: AffectedRequestDto): Observable<void> {
        return this.assignUsersUseCase.execute(payload).pipe(
            tap(() => {
                const successMessage = this.translateService.instant(
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.MESSAGES.SUCCESS.AFFECTED'
                );
                this.toastService.success(successMessage);
            })
        );
    }

    getUsersByProfile(
        profileId: string,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        filter?: { matricule?: string }
    ): Observable<Paginate<User>> {
        return this.getUsersByProfileUseCase.execute(profileId, page, filter);
    }

    getUsersWithoutProfile(
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        filter?: { matricule?: string }
    ): Observable<Paginate<User>> {
        return this.getUsersWithoutProfileUseCase.execute(page, filter);
    }
}
