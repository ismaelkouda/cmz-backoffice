import { ForgotPasswordRequestEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-request.entity';
import { ForgotPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-response.entity';
import { Observable } from 'rxjs';

export abstract class ForgotPasswordRepository {
    abstract execute(
        entity: ForgotPasswordRequestEntity
    ): Observable<ForgotPasswordResponseEntity>;
}
