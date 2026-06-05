import { Observable } from 'rxjs';

import { ProfileUpdateEntity } from '../entities/profile-update.entity';
import { MessageEntity } from '@shared/domain/entities/message.entity';

export abstract class ProfileUpdateRepository {
    abstract execute(entity: ProfileUpdateEntity): Observable<MessageEntity>;
}
