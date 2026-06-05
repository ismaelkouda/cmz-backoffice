import { map, Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { inject, Injectable } from '@angular/core';
import { LogoutRepository } from '../../../domain/repositories/logout.repository';
import { MyAccountApi } from '../../api/my-account.api';
import { MessageResultMapper } from '@shared/data/mappers/message-result.mapper';

@Injectable()
export class LogoutRepositoryImpl extends LogoutRepository {
    private readonly api = inject(MyAccountApi);
    private readonly messageMapper = inject(MessageResultMapper);

    execute(): Observable<MessageEntity> {
        return this.api
            .logout()
            .pipe(
                map((response) => this.messageMapper.mapFromMessage(response))
            );
    }
}
