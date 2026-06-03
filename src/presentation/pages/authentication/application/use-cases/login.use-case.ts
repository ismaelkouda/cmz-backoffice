import { Injectable, inject } from '@angular/core';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login-response.entity';
import { LoginRepository } from '@presentation/pages/authentication/domain/repositories/login.repository';
import { LoginRequestVo } from '@presentation/pages/authentication/domain/value-objects/login-request.vo';
import { Observable } from 'rxjs';
import { LoginRequestDto } from '@presentation/pages/authentication/application/dto/login-request.dto';
import { LoginRequestEntity } from '@presentation/pages/authentication/domain/entities/login-request.entity';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
    private readonly repository = inject(LoginRepository);

    execute(dto: LoginRequestDto): Observable<LoginResponseEntity> {
        const vo = LoginRequestVo.fromDto(dto);
        const entity = LoginRequestEntity.fromVo(vo);
        return this.repository.login(entity);
    }
}
