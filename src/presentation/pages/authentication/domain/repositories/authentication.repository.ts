import { Observable } from 'rxjs';
import { AuthSession } from '@pages/authentication/domain/entities/auth-session.entity';
import { AuthVariables } from '@pages/authentication/domain/entities/auth-variables.entity';
import { LoginCredentials } from '@pages/authentication/domain/value-objects/login-credentials.vo';
export abstract class AuthenticationRepository {
    abstract login(credentials: LoginCredentials): Observable<AuthSession>;
    abstract loadVariables(): Observable<AuthVariables>;
}
