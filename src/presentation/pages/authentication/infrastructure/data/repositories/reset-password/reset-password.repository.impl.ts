import { Injectable, inject } from '@angular/core';
import { ResetPasswordResponseDto } from '@presentation/pages/authentication/infrastructure/api/dto/reset-password/reset-password-response-api.dto';
import { ResetPasswordResponseMapper } from '@presentation/pages/authentication/infrastructure/data/mappers/reset-password/reset-password-response.mapper';
import { ResetPasswordApi } from '@presentation/pages/authentication/infrastructure/data/sources/reset-password/reset-password.api';
import { ResetPasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/reset-password/reset-password-request.validate-contract';
import { ResetPasswordRepository } from '@presentation/pages/authentication/domain/repositories/reset-password/reset-password.repository';
import { ResetPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-response.entity';
import { resetPasswordRequestMapper } from '@presentation/pages/authentication/infrastructure/data/mappers/reset-password/reset-password-request.mapper';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResetPasswordRepositoryImpl implements ResetPasswordRepository {
    private readonly api = inject(ResetPasswordApi);
    private readonly mapper = inject(ResetPasswordResponseMapper);

    execute(
        validContract: ResetPasswordRequestValidateContract
    ): Observable<ResetPasswordResponseEntity> {
        const dto = resetPasswordRequestMapper(validContract);
        return this.api
            .execute(dto)
            .pipe(
                map((response: ResetPasswordResponseDto) =>
                    this.mapper.mapFromDto(response)
                )
            );
    }
}
