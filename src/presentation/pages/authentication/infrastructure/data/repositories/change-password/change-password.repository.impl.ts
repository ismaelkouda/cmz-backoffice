import { Injectable, inject } from '@angular/core';
import { ChangePasswordResponseApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/change-password/change-password-response-api.dto';
import { ChangePasswordResponseMapper } from '@presentation/pages/authentication/infrastructure/data/mappers/change-password/change-password-response.mapper';
import { ChangePasswordApi } from '@presentation/pages/authentication/infrastructure/data/sources/change-password/change-password.api';
import { ChangePasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/change-password/change-password-request.validate-contract';
import { ChangePasswordRepository } from '@presentation/pages/authentication/domain/repositories/change-password/change-password.repository';
import { ChangePasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/change-password/change-password-response.entity';
import { changePasswordRequestMapper } from '@presentation/pages/authentication/infrastructure/data/mappers/change-password/change-password-request.mapper';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChangePasswordRepositoryImpl implements ChangePasswordRepository {
    private readonly api = inject(ChangePasswordApi);
    private readonly mapper = inject(ChangePasswordResponseMapper);

    execute(
        validContract: ChangePasswordRequestValidateContract
    ): Observable<ChangePasswordResponseEntity> {
        const dto = changePasswordRequestMapper(validContract);
        return this.api
            .execute(dto)
            .pipe(
                map((response: ChangePasswordResponseApiDto) =>
                    this.mapper.mapFromDto(response)
                )
            );
    }
}
