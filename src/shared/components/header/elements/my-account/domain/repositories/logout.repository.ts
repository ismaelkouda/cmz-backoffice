import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';

export abstract class LogoutRepository {
    abstract execute(): Observable<MessageEntity>;
}
