import { inject, Injectable } from '@angular/core';
import { TwoFactorEnableDto } from '../dto/two-factor-enable.dto';
import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { TwoFactorEnableVo } from '../../domain/value-objects/two-factor-enable.vo';
import { TwoFactorEnableEntity } from '../../domain/entities/two-factor-enable.entity';
import { TwoFactorEnableRepository } from '../../domain/repositories/two-factor-enable.repository';

@Injectable({ providedIn: 'root' })
export class TwoFactorEnableUseCase {
    private readonly repository = inject(TwoFactorEnableRepository);

    execute(dto: TwoFactorEnableDto): Observable<MessageEntity> {
        const vo = TwoFactorEnableVo.fromDto(dto);
        const entity = TwoFactorEnableEntity.fromVo(vo);
        return this.repository.execute(entity);
    }
}
