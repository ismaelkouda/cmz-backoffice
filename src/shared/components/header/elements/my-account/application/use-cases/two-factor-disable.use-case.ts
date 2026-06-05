import { inject, Injectable } from '@angular/core';
import { TwoFactorDisableDto } from '../dto/two-factor-disable.dto';
import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { TwoFactorDisableVo } from '../../domain/value-objects/two-factor-disable.vo';
import { TwoFactorDisableEntity } from '../../domain/entities/two-factor-disable.entity';
import { TwoFactorDisableRepository } from '../../domain/repositories/two-factor-disable.repository';

@Injectable({ providedIn: 'root' })
export class TwoFactorDisableUseCase {
    private readonly repository = inject(TwoFactorDisableRepository);

    execute(dto: TwoFactorDisableDto): Observable<MessageEntity> {
        const vo = TwoFactorDisableVo.fromDto(dto);
        const entity = TwoFactorDisableEntity.fromVo(vo);
        return this.repository.execute(entity);
    }
}
