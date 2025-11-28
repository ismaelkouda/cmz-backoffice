import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionsPayloadEntity } from '../entities/actions/actions-payload.entity';
import { ActionsRepository } from '../repositories/actions.repository';

@Injectable({ providedIn: 'root' })
export class CreateActionUseCase {
    private readonly actionsRepository = inject(ActionsRepository);

    execute(payload: ActionsPayloadEntity): Observable<{ id: string }> {
        return this.actionsRepository.createAction(payload);
    }
}
