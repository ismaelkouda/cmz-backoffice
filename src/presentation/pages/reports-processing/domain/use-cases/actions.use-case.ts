import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { ActionsEntity } from '../entities/actions/actions.entity';
import { ActionsRepository } from '../repositories/actions.repository';
import { ActionsFilter } from '../value-objects/actions-filter.vo';

@Injectable({ providedIn: 'root' })
export class FetchActionsUseCase {
    private readonly actionsRepository = inject(ActionsRepository);

    execute(
        filter: ActionsFilter | null,
        page: string
    ): Observable<Paginate<ActionsEntity>> {
        return this.actionsRepository.fetchActions(filter, page);
    }
}
