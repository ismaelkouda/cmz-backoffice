import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionsPayloadEntity } from '../entities/actions/actions-payload.entity';
import { ActionsRepository } from '../repositories/actions.repository';

@Injectable({ providedIn: 'root' })
export class UpdateActionUseCase {
    private readonly actionsRepository = inject(ActionsRepository);

    execute(id: string, payload: ActionsPayloadEntity): Observable<void> {
        return this.actionsRepository.updateAction(id, payload);
    }
}
