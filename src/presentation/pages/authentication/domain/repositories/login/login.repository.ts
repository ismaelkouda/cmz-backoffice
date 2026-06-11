import { LoginRequestEntity } from '@presentation/pages/authentication/domain/entities/login/login-request.entity';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class LoginRepository {
    abstract execute(
        entity: LoginRequestEntity,
        options?: FetchOptions
    ): Observable<LoginResponseEntity>;
}
