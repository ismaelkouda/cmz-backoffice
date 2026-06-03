import { Injectable, inject } from '@angular/core';
import { LoginResponseDto } from '@presentation/pages/authentication/infrastructure/dto/login-response-api.dto';
import { LoginResponseMapper } from '@presentation/pages/authentication/infrastructure/mappers/login-response.mapper';
import { AuthenticationApi } from '@presentation/pages/authentication/infrastructure/sources/authentication.api';
import { LoginRequestEntity } from '@presentation/pages/authentication/domain/entities/login-request.entity';
import { LoginRepository } from '@presentation/pages/authentication/domain/repositories/login.repository';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login-response.entity';
import { loginRequestMapper } from '@presentation/pages/authentication/infrastructure/mappers/login-request.mapper';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginRepositoryImpl extends LoginRepository {
    private readonly api = inject(AuthenticationApi);
    private readonly mapper = inject(LoginResponseMapper);

    override login(
        entity: LoginRequestEntity
    ): Observable<LoginResponseEntity> {
        const dto = loginRequestMapper(entity);
        return this.api
            .login(dto)
            .pipe(
                map((response: LoginResponseDto) =>
                    this.mapper.mapFromDto(response)
                )
            );
    }
}
