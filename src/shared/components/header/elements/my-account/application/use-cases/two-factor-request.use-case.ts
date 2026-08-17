import { inject, Injectable } from '@angular/core';
import { TwoFactorRequestDto } from '../dto/two-factor-request.dto';
import { Observable } from 'rxjs';
import { TwoFactorRequestVo } from '../../domain/value-objects/two-factor-request.vo';
import { TwoFactorRequestEntity } from '../../domain/entities/two-factor-request.entity';
import { TwoFactorRequestRepository } from '../../domain/repositories/two-factor-request.repository';
import { TwoFactorRequestResultEntity } from '../../domain/entities/two-factor-request-result.entity';

@Injectable({ providedIn: 'root' })
export class TwoFactorRequestUseCase {
    private readonly repository = inject(TwoFactorRequestRepository);

    execute(
        dto: TwoFactorRequestDto
    ): Observable<TwoFactorRequestResultEntity> {
        const vo = TwoFactorRequestVo.fromDto(dto);
        const entity = TwoFactorRequestEntity.fromVo(vo);
        return this.repository.execute(entity);
    }
}
