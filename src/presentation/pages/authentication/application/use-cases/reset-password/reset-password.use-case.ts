import { Injectable, inject } from '@angular/core';
import { ResetPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-response.entity';
import { ResetPasswordRepository } from '@presentation/pages/authentication/domain/repositories/reset-password/reset-password.repository';
import { ResetPasswordRequestVo } from '@presentation/pages/authentication/domain/value-objects/reset-password/reset-password-request.vo';
import { Observable } from 'rxjs';
import { ResetPasswordRequestDto } from '@presentation/pages/authentication/application/dto/reset-password/reset-password-request.dto';
import { ResetPasswordRequestEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-request.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class ResetPasswordUseCase {
    private readonly repository = inject(ResetPasswordRepository);

    execute(
        dto: ResetPasswordRequestDto,
        options?: FetchOptions
    ): Observable<ResetPasswordResponseEntity> {
        const vo = ResetPasswordRequestVo.fromDto(dto);
        const entity = ResetPasswordRequestEntity.fromVo(vo);
        return this.repository.execute(entity, options);
    }
}
