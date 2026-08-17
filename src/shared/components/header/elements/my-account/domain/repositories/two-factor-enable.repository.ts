import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { TwoFactorEnableEntity } from '../entities/two-factor-enable.entity';

export abstract class TwoFactorEnableRepository {
    abstract execute(entity: TwoFactorEnableEntity): Observable<MessageEntity>;
}
