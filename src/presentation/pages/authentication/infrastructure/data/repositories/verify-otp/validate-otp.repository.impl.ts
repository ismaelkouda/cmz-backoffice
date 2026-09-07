import { map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { ValidateOtpRepository } from '@presentation/pages/authentication/domain/repositories/verify-otp/validate-otp.repository';
import { ValidateOtpRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/verify-otp/validate-otp-request.validate-contract';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { ValidateOtpApi } from '@presentation/pages/authentication/infrastructure/data/sources/verify-otp/validate-otp.api';
import { validateOtpRequestMapper } from '@presentation/pages/authentication/infrastructure/data/mappers/verify-otp/validate-otp-request.mapper';
import { LoginResponseMapper } from '@presentation/pages/authentication/infrastructure/data/mappers/login/login-response.mapper';

@Injectable({ providedIn: 'root' })
export class ValidateOtpRepositoryImpl implements ValidateOtpRepository {
    private readonly api = inject(ValidateOtpApi);
    private readonly mapper = inject(LoginResponseMapper);

    execute(
        validContract: ValidateOtpRequestValidateContract
    ): Observable<LoginResponseEntity> {
        const dto = validateOtpRequestMapper(validContract);
        return this.api
            .execute(dto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
