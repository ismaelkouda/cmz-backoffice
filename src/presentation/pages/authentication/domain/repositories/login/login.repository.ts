import { LoginRequestEntity } from '@presentation/pages/authentication/domain/entities/login/login-request.entity';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { Observable } from 'rxjs';

export abstract class LoginRepository {
    abstract execute(
        entity: LoginRequestEntity
    ): Observable<LoginResponseEntity>;
}
