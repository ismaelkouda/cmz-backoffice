import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionsRepository } from '../repositories/actions.repository';

@Injectable({ providedIn: 'root' })
export class DeleteActionUseCase {
    private readonly actionsRepository = inject(ActionsRepository);

    execute(id: string): Observable<void> {
        return this.actionsRepository.deleteAction(id);
    }
}
