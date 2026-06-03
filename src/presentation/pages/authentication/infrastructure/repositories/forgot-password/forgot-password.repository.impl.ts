import { Injectable, inject } from '@angular/core';
import { ForgotPasswordResponseDto } from '@presentation/pages/authentication/infrastructure/dto/forgot-password/forgot-password-response-api.dto';
import { ForgotPasswordResponseMapper } from '@presentation/pages/authentication/infrastructure/mappers/forgot-password/forgot-password-response.mapper';
import { ForgotPasswordApi } from '@presentation/pages/authentication/infrastructure/sources/forgot-password/forgot-password.api';
import { ForgotPasswordRequestEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-request.entity';
import { ForgotPasswordRepository } from '@presentation/pages/authentication/domain/repositories/forgot-password/forgot-password.repository';
import { ForgotPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-response.entity';
import { forgotPasswordRequestMapper } from '@presentation/pages/authentication/infrastructure/mappers/forgot-password/forgot-password-request.mapper';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordRepositoryImpl extends ForgotPasswordRepository {
    private readonly api = inject(ForgotPasswordApi);
    private readonly mapper = inject(ForgotPasswordResponseMapper);

    override execute(
        entity: ForgotPasswordRequestEntity
    ): Observable<ForgotPasswordResponseEntity> {
        const dto = forgotPasswordRequestMapper(entity);
        return this.api
            .execute(dto)
            .pipe(
                map((response: ForgotPasswordResponseDto) =>
                    this.mapper.mapFromDto(response)
                )
            );
    }
}
