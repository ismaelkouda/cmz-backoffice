import { LoginRequestEntity } from '@presentation/pages/authentication/domain/entities/login-request.entity';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login-response.entity';
import { Observable } from 'rxjs';

export abstract class LoginRepository {
    abstract login(entity: LoginRequestEntity): Observable<LoginResponseEntity>;
}
