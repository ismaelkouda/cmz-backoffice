import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AuthSession } from '@pages/authentication/domain/entities/auth-session.entity';
import { AuthVariables } from '@pages/authentication/domain/entities/auth-variables.entity';
import { AuthenticationRepository } from '@pages/authentication/domain/repositories/authentication.repository';
import { LoginCredentials } from '@pages/authentication/domain/value-objects/login-credentials.vo';
import { LoginResponseDto } from '@pages/authentication/data/dtos/login-response.dto';
import { VariablesResponseDto } from '@pages/authentication/data/dtos/variables-response.dto';
import { AuthSessionMapper } from '@pages/authentication/data/mappers/auth-session.mapper';
import { AuthVariablesMapper } from '@pages/authentication/data/mappers/auth-variables.mapper';
import { AuthenticationApi } from '@pages/authentication/data/sources/authentication.api';

@Injectable({ providedIn: 'root' })
export class AuthenticationRepositoryImpl extends AuthenticationRepository {
    constructor(
        private readonly api: AuthenticationApi,
        private readonly sessionMapper: AuthSessionMapper,
        private readonly variablesMapper: AuthVariablesMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    override login(credentials: LoginCredentials): Observable<AuthSession> {
        return this.api.login(credentials.toDto()).pipe(
            map((response: LoginResponseDto) =>
                this.sessionMapper.mapFromDto(response)
            ),
            catchError((error: unknown) =>
                throwError(
                    () =>
                        new Error(
                            error instanceof Error
                                ? error.message
                                : this.translateService.instant(
                                      'AUTHENTICATION.MESSAGES.ERROR.UNABLE_TO_COMPLETE_LOGIN'
                                  )
                        )
                )
            )
        );
    }

    override loadVariables(): Observable<AuthVariables> {
        return this.api.loadVariables().pipe(
            map((response: VariablesResponseDto) =>
                this.variablesMapper.mapFromDto(response)
            ),
            catchError((error: unknown) =>
                throwError(
                    () =>
                        new Error(
                            error instanceof Error
                                ? error.message
                                : this.translateService.instant(
                                      'AUTHENTICATION.MESSAGES.ERROR.UNABLE_TO_LOAD_VARIABLES'
                                  )
                        )
                )
            )
        );
    }
}
