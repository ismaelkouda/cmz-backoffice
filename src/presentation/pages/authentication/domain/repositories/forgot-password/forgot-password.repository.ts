import { ForgotPasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/forgot-password/forgot-password-request.validate-contract';
import { ForgotPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-response.entity';
import { Observable } from 'rxjs';

export abstract class ForgotPasswordRepository {
    abstract execute(
        validContract: ForgotPasswordRequestValidateContract
    ): Observable<ForgotPasswordResponseEntity>;
}
