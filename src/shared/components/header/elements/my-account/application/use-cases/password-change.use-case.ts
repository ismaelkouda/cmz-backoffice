import { inject, Injectable } from '@angular/core';
import { PasswordChangeDto } from '../dto/password-change.dto';
import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { PasswordChangeVo } from '../../domain/value-objects/password-change.vo';
import { PasswordChangeEntity } from '../../domain/entities/password-change.entity';
import { PasswordChangeRepository } from '../../domain/repositories/password-change.repository';

@Injectable({ providedIn: 'root' })
export class PasswordChangeUseCase {
    private readonly repository = inject(PasswordChangeRepository);

    execute(dto: PasswordChangeDto): Observable<MessageEntity> {
        const vo = PasswordChangeVo.fromDto(dto);
        const entity = PasswordChangeEntity.fromVo(vo);
        return this.repository.execute(entity);
    }
}
