import { Observable } from 'rxjs';

import { PasswordChangeEntity } from '../entities/password-change.entity';
import { MessageEntity } from '@shared/domain/entities/message.entity';

export abstract class PasswordChangeRepository {
    abstract execute(entity: PasswordChangeEntity): Observable<MessageEntity>;
}
