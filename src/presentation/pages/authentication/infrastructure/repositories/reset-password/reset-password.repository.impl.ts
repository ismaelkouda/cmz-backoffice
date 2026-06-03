import { Injectable, inject } from '@angular/core';
import { ResetPasswordResponseDto } from '@presentation/pages/authentication/infrastructure/dto/reset-password/reset-password-response-api.dto';
import { ResetPasswordResponseMapper } from '@presentation/pages/authentication/infrastructure/mappers/reset-password/reset-password-response.mapper';
import { ResetPasswordApi } from '@presentation/pages/authentication/infrastructure/sources/reset-password/reset-password.api';
import { ResetPasswordRequestEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-request.entity';
import { ResetPasswordRepository } from '@presentation/pages/authentication/domain/repositories/reset-password/reset-password.repository';
import { ResetPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-response.entity';
import { resetPasswordRequestMapper } from '@presentation/pages/authentication/infrastructure/mappers/reset-password/reset-password-request.mapper';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResetPasswordRepositoryImpl extends ResetPasswordRepository {
    private readonly api = inject(ResetPasswordApi);
    private readonly mapper = inject(ResetPasswordResponseMapper);

    override execute(
        entity: ResetPasswordRequestEntity
    ): Observable<ResetPasswordResponseEntity> {
        const dto = resetPasswordRequestMapper(entity);
        return this.api
            .execute(dto)
            .pipe(
                map((response: ResetPasswordResponseDto) =>
                    this.mapper.mapFromDto(response)
                )
            );
    }
}
