import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthSession } from '@pages/authentication/domain/entities/auth-session.entity';
import { AuthVariables } from '@pages/authentication/domain/entities/auth-variables.entity';
import {
    LoadAuthenticationVariablesUseCase,
    LoginUseCase,
} from '@pages/authentication/domain/use-cases/authentication.use-case';
import { LoginCredentials } from '@pages/authentication/domain/value-objects/login-credentials.vo';
import { ToastrService } from 'ngx-toastr';
import {
    BehaviorSubject,
    Observable,
    catchError,
    finalize,
    tap,
    throwError,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationFacade {
    private readonly sessionSubject = new BehaviorSubject<AuthSession | null>(
        null
    );
    private readonly variablesSubject =
        new BehaviorSubject<AuthVariables | null>(null);
    private readonly loginLoadingSubject = new BehaviorSubject<boolean>(false);

    readonly session$: Observable<AuthSession | null> =
        this.sessionSubject.asObservable();
    readonly variables$: Observable<AuthVariables | null> =
        this.variablesSubject.asObservable();
    readonly isLoginLoading$: Observable<boolean> =
        this.loginLoadingSubject.asObservable();

    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly loadVariablesUseCase: LoadAuthenticationVariablesUseCase,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService
    ) {}

    login(
        payload: Readonly<{
            email: string;
            password: string;
        }>
    ): Observable<AuthSession> {
        const credentials = LoginCredentials.create(payload);
        this.loginLoadingSubject.next(true);

        return this.loginUseCase.execute(credentials).pipe(
            tap((session) => {
                this.sessionSubject.next(session);
                const welcomeMessage = this.translateService.instant(
                    'AUTHENTICATION.MESSAGES.SUCCESS.WELCOME',
                    {
                        lastName: session.user.last_name,
                        firstName: session.user.first_name,
                    }
                );
                this.toastService.success(welcomeMessage);
            }),
            finalize(() => this.loginLoadingSubject.next(false)),
            catchError((error: Error) => {
                const errorMessage =
                    this.translateService.instant(error.message) ||
                    error.message;
                this.toastService.error(errorMessage);
                return throwError(() => error);
            })
        );
    }

    loadVariables(): Observable<AuthVariables> {
        return this.loadVariablesUseCase.execute().pipe(
            tap((variables) => this.variablesSubject.next(variables)),
            catchError((error: Error) => {
                const errorMessage =
                    this.translateService.instant(error.message) ||
                    error.message;
                this.toastService.error(errorMessage);
                return throwError(() => error);
            })
        );
    }
}
