import { LoginRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/login/login-request.validate-contract';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { Observable } from 'rxjs';

export abstract class LoginRepository {
    abstract execute(
        validContract: LoginRequestValidateContract
    ): Observable<LoginResponseEntity>;
}
