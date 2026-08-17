import { inject, Injectable } from '@angular/core';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { Observable } from 'rxjs';
import { LogoutUseCase } from '../use-cases/logout.use-case';

@Injectable({ providedIn: 'root' })
export class LogoutHandler {
    private readonly useCase = inject(LogoutUseCase);

    execute(): Observable<MessageEntity> {
        return this.useCase.execute();
    }
}
