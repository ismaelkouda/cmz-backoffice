import { Injectable } from '@angular/core';
import { ɵFormGroupRawValue, ɵTypedOrUntyped } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiError } from '@shared/domain/errors/api.error';
import { ToastrService } from 'ngx-toastr';
import {
    BehaviorSubject,
    Observable,
    catchError,
    debounceTime,
    finalize,
    tap,
    throwError,
} from 'rxjs';
import { PAGINATION_CONST } from '../../../../shared/constants/pagination.constants';
import { ManagementFormControlEntity } from '../domain/entities/management/management-form-control.entity';
import { ManagementEntity } from '../domain/entities/management/management.entity';
import { ManagementUseCase } from '../domain/use-cases/management.use-case';
import { ManagementForm } from '../domain/value-objects/management-form.vo';

@Injectable({
    providedIn: 'root',
})
export class ManagementFacade {
    private readonly loadingSubject = new BehaviorSubject<boolean>(false);
    public readonly loading$ = this.loadingSubject.asObservable();

    constructor(
        private managementUseCase: ManagementUseCase,
        private toastService: ToastrService,
        protected readonly translateService: TranslateService
    ) {}

    take(
        credentials: ɵTypedOrUntyped<
            ManagementFormControlEntity,
            ɵFormGroupRawValue<ManagementFormControlEntity>,
            any
        >
    ): void {
        if (this.loadingSubject.getValue()) {
            return;
        }

        this.loadingSubject.next(true);

        const payload = ManagementForm.create(credentials);
        this.managementUseCase.executeFetchTake(payload).pipe(
            debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
            tap((response) => {
                if (!response.error && response.message) {
                    this.toastService.success(response.message);
                } else {
                    this.toastService.error(response.message);
                }
            }),
            finalize(() => this.loadingSubject.next(false)),
            catchError((error: unknown) => {
                const errorMessage = this.getErrorMessage(error);
                this.toastService.error(errorMessage);
                return throwError(() => error);
            })
        );
    }

    approve(
        credentials: ɵTypedOrUntyped<
            ManagementFormControlEntity,
            ɵFormGroupRawValue<ManagementFormControlEntity>,
            any
        >
    ): Observable<ManagementEntity> | void {
        if (this.loadingSubject.getValue()) {
            return throwError(() => new Error('Operation already in progress'));
        }

        this.loadingSubject.next(true);

        const payload = ManagementForm.create(credentials);
        this.managementUseCase
            .executeFetchApprove(payload)
            .pipe(
                debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
                tap((response) => {
                    if (!response.error && response.message) {
                        this.toastService.success(response.message);
                    } else {
                        this.toastService.error(response.message);
                    }
                }),
                finalize(() => this.loadingSubject.next(false)),
                catchError((error: unknown) => {
                    const errorMessage = this.getErrorMessage(error);
                    this.toastService.error(errorMessage);
                    return throwError(() => error);
                })
            )
            .subscribe();
    }

    reject(
        credentials: ɵTypedOrUntyped<
            ManagementFormControlEntity,
            ɵFormGroupRawValue<ManagementFormControlEntity>,
            any
        >
    ): Observable<ManagementEntity> | void {
        const payload = ManagementForm.create(credentials);

        if (this.loadingSubject.getValue()) {
            return throwError(() => new Error('Operation already in progress'));
        }

        this.loadingSubject.next(true);

        this.managementUseCase
            .executeFetchReject(payload)
            .pipe(
                debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
                tap((response) => {
                    if (!response.error && response.message) {
                        this.toastService.success(response.message);
                    } else {
                        this.toastService.error(response.message);
                    }
                }),
                finalize(() => this.loadingSubject.next(false)),
                catchError((error: unknown) => {
                    const errorMessage = this.getErrorMessage(error);
                    this.toastService.error(errorMessage);
                    return throwError(() => error);
                })
            )
            .subscribe();
    }

    process(
        credentials: ɵTypedOrUntyped<
            ManagementFormControlEntity,
            ɵFormGroupRawValue<ManagementFormControlEntity>,
            any
        >
    ): Observable<ManagementEntity> | void {
        const payload = ManagementForm.create(credentials);

        if (this.loadingSubject.getValue()) {
            return throwError(() => new Error('Operation already in progress'));
        }

        this.loadingSubject.next(true);

        this.managementUseCase
            .executeFetchProcess(payload)
            .pipe(
                debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
                tap((response) => {
                    if (!response.error && response.message) {
                        this.toastService.success(response.message);
                    } else {
                        this.toastService.error(response.message);
                    }
                }),
                finalize(() => this.loadingSubject.next(false)),
                catchError((error: unknown) => {
                    const errorMessage = this.getErrorMessage(error);
                    this.toastService.error(errorMessage);
                    return throwError(() => error);
                })
            )
            .subscribe();
    }

    protected getErrorMessage(error: unknown): string {
        if (error instanceof ApiError) {
            const translatedMessage = this.translateService.instant(error.code);
            if (translatedMessage === error.code) {
                return error.message;
            }
            return translatedMessage;
        }

        if (error instanceof Error) {
            const translatedMessage = this.translateService.instant(
                error.message
            );
            if (translatedMessage === error.message) {
                return error.message;
            }
            return translatedMessage;
        }

        return this.translateService.instant(
            'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNKNOWN_ERROR'
        );
    }
}
