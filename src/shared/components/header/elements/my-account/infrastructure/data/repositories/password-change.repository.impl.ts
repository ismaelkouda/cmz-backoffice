import { map, Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { inject, Injectable } from '@angular/core';
import { PasswordChangeRepository } from '../../../domain/repositories/password-change.repository';
import { MyAccountApi } from '../../api/my-account.api';
import { MessageResultMapper } from '@shared/data/mappers/message-result.mapper';
import { PasswordChangeEntity } from '../../../domain/entities/password-change.entity';
import { passwordChangeMapper } from '../mappers/password-change.mapper';

@Injectable()
export class PasswordChangeRepositoryImpl extends PasswordChangeRepository {
    private readonly api = inject(MyAccountApi);
    private readonly messageMapper = inject(MessageResultMapper);

    execute(entity: PasswordChangeEntity): Observable<MessageEntity> {
        const dto = passwordChangeMapper(entity);
        return this.api
            .passwordChange(dto)
            .pipe(
                map((response) => this.messageMapper.mapFromMessage(response))
            );
    }
}
