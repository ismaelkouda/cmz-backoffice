import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { ProfileUpdateCommand } from '../commands/profile-update.command';
import { ProfileUpdateUseCase } from '../use-cases/profile-update.use-case';

@Injectable({ providedIn: 'root' })
export class ProfileUpdateHandler {
    private readonly useCase = inject(ProfileUpdateUseCase);

    execute(command: ProfileUpdateCommand): Observable<MessageEntity> {
        return this.useCase.execute({
            id: command.id,
            lastName: command.lastName,
            firstName: command.firstName,
            email: command.email,
            phone: command.phone,
        });
    }
}
