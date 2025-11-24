import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ApiError } from '@shared/domain/errors/api.error';
import { ToastrService } from 'ngx-toastr';
import {
    BehaviorSubject,
    Observable,
    catchError,
    debounceTime,
    finalize,
    throwError,
} from 'rxjs';
import { LogoutEntity } from '../domain/entities/logout.entity';
import { MyAccountUseCase } from '../domain/use-cases/my-account.use-case';

@Injectable({
    providedIn: 'root',
})
export class MyAccountFacade {
    private readonly loadingSubject = new BehaviorSubject<boolean>(false);
    public readonly loading$ = this.loadingSubject.asObservable();

    constructor(
        private readonly myAccountUseCase: MyAccountUseCase,
        private readonly toastService: ToastrService,
        protected readonly translateService: TranslateService
    ) {}

    logout(): Observable<LogoutEntity> {
        if (this.loadingSubject.getValue()) {
            return throwError(() => new Error('Operation logout in progress'));
        }
        this.loadingSubject.next(true);
        return this.myAccountUseCase.executeFetchTake().pipe(
            debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
            finalize(() => this.loadingSubject.next(false)),
            catchError((error: unknown) => {
                const errorMessage = this.getErrorMessage(error);
                this.toastService.error(errorMessage);
                return throwError(() => error);
            })
        );
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
