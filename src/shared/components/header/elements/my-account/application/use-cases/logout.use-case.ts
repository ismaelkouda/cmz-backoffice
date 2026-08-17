import { inject, Injectable } from '@angular/core';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { Observable } from 'rxjs';
import { LogoutRepository } from '../../domain/repositories/logout.repository';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
    private readonly repository = inject(LogoutRepository);

    execute(): Observable<MessageEntity> {
        return this.repository.execute();
    }
}
