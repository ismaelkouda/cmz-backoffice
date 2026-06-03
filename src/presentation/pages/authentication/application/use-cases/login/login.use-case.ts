import { Injectable, inject } from '@angular/core';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { LoginRepository } from '@presentation/pages/authentication/domain/repositories/login/login.repository';
import { LoginRequestVo } from '@presentation/pages/authentication/domain/value-objects/login/login-request.vo';
import { Observable } from 'rxjs';
import { LoginRequestDto } from '@presentation/pages/authentication/application/dto/login/login-request.dto';
import { LoginRequestEntity } from '@presentation/pages/authentication/domain/entities/login/login-request.entity';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
    private readonly repository = inject(LoginRepository);

    execute(dto: LoginRequestDto): Observable<LoginResponseEntity> {
        const vo = LoginRequestVo.fromDto(dto);
        const entity = LoginRequestEntity.fromVo(vo);
        return this.repository.execute(entity);
    }
}
