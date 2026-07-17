import { ResetPasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/reset-password/reset-password-request.validate-contract';
import { ResetPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-response.entity';
import { Observable } from 'rxjs';

export abstract class ResetPasswordRepository {
    abstract execute(
        validContract: ResetPasswordRequestValidateContract
    ): Observable<ResetPasswordResponseEntity>;
}
