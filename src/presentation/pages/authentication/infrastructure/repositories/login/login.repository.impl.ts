import { Injectable, inject } from '@angular/core';
import { LoginResponseDto } from '@presentation/pages/authentication/infrastructure/dto/login/login-response-api.dto';
import { LoginResponseMapper } from '@presentation/pages/authentication/infrastructure/mappers/login/login-response.mapper';
import { LoginApi } from '@presentation/pages/authentication/infrastructure/sources/login/login.api';
import { LoginRequestEntity } from '@presentation/pages/authentication/domain/entities/login/login-request.entity';
import { LoginRepository } from '@presentation/pages/authentication/domain/repositories/login/login.repository';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { loginRequestMapper } from '@presentation/pages/authentication/infrastructure/mappers/login/login-request.mapper';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginRepositoryImpl extends LoginRepository {
    private readonly api = inject(LoginApi);
    private readonly mapper = inject(LoginResponseMapper);

    override execute(
        entity: LoginRequestEntity
    ): Observable<LoginResponseEntity> {
        const dto = loginRequestMapper(entity);
        return this.api
            .execute(dto)
            .pipe(
                map((response: LoginResponseDto) =>
                    this.mapper.mapFromDto(response)
                )
            );
    }
}
