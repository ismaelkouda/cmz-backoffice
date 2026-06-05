import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { TwoFactorDisableEntity } from '../entities/two-factor-disable.entity';

export abstract class TwoFactorDisableRepository {
    abstract execute(entity: TwoFactorDisableEntity): Observable<MessageEntity>;
}
