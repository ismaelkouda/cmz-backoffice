import { ResetPasswordRequestEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-request.entity';
import { ResetPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-response.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ResetPasswordRepository {
    abstract execute(
        entity: ResetPasswordRequestEntity,
        options?: FetchOptions
    ): Observable<ResetPasswordResponseEntity>;
}
