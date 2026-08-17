import { Injectable, inject } from '@angular/core';
import { LoginResponseDto } from '@presentation/pages/authentication/infrastructure/api/dto/login/login-response-api.dto';
import { LoginResponseMapper } from '@presentation/pages/authentication/infrastructure/data/mappers/login/login-response.mapper';
import { LoginApi } from '@presentation/pages/authentication/infrastructure/data/sources/login/login.api';
import { LoginRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/login/login-request.validate-contract';
import { LoginRepository } from '@presentation/pages/authentication/domain/repositories/login/login.repository';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { loginRequestMapper } from '@presentation/pages/authentication/infrastructure/data/mappers/login/login-request.mapper';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginRepositoryImpl implements LoginRepository {
    private readonly api = inject(LoginApi);
    private readonly mapper = inject(LoginResponseMapper);

    execute(
        validContract: LoginRequestValidateContract
    ): Observable<LoginResponseEntity> {
        const dto = loginRequestMapper(validContract);
        return this.api
            .execute(dto)
            .pipe(
                map((response: LoginResponseDto) =>
                    this.mapper.mapFromDto(response)
                )
            );
    }
}
