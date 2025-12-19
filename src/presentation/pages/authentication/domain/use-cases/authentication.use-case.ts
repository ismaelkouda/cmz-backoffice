import { Injectable } from '@angular/core';
import { AuthSession } from '@pages/authentication/domain/entities/auth-session.entity';
import { AuthVariables } from '@pages/authentication/domain/entities/auth-variables.entity';
import { AuthenticationRepository } from '@pages/authentication/domain/repositories/authentication.repository';
import { LoginCredentials } from '@pages/authentication/domain/value-objects/login-credentials.vo';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class LoginUseCase {
    constructor(private readonly authenticationRepository: AuthenticationRepository) { }

    execute(credentials: LoginCredentials): Observable<AuthSession> {
        return this.authenticationRepository.login(credentials);
    }
}

@Injectable({ providedIn: 'root' })
export class LoadAuthenticationVariablesUseCase {
    constructor(
        private readonly authenticationRepository: AuthenticationRepository
    ) { }

    execute(): Observable<AuthVariables> {
        return this.authenticationRepository.loadVariables();
    }
}
