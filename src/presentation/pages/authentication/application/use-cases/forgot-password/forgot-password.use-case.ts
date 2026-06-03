import { Injectable, inject } from '@angular/core';
import { ForgotPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-response.entity';
import { ForgotPasswordRepository } from '@presentation/pages/authentication/domain/repositories/forgot-password/forgot-password.repository';
import { ForgotPasswordRequestVo } from '@presentation/pages/authentication/domain/value-objects/forgot-password/forgot-password-request.vo';
import { Observable } from 'rxjs';
import { ForgotPasswordRequestDto } from '@presentation/pages/authentication/application/dto/forgot-password/forgot-password-request.dto';
import { ForgotPasswordRequestEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-request.entity';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordUseCase {
    private readonly repository = inject(ForgotPasswordRepository);

    execute(
        dto: ForgotPasswordRequestDto
    ): Observable<ForgotPasswordResponseEntity> {
        const vo = ForgotPasswordRequestVo.fromDto(dto);
        const entity = ForgotPasswordRequestEntity.fromVo(vo);
        return this.repository.execute(entity);
    }
}
