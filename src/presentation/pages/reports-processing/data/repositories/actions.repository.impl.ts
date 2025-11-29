import { Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';
import { ActionsPayloadEntity } from '../../domain/entities/actions/actions-payload.entity';
import { ActionsEntity } from '../../domain/entities/actions/actions.entity';
import { ActionsRepository } from '../../domain/repositories/actions.repository';
import { ActionsFilter } from '../../domain/value-objects/actions-filter.vo';
import { ActionsMapper } from '../mappers/actions.mapper';
import { ActionsApi } from '../sources/actions.api';

@Injectable({ providedIn: 'root' })
export class ActionsRepositoryImpl extends ActionsRepository {
    constructor(
        private readonly actionsApi: ActionsApi,
        private readonly actionsMapper: ActionsMapper
    ) {
        super();
    }

    fetchActions(
        filter: ActionsFilter,
        page: string
    ): Observable<Paginate<ActionsEntity>> {
        return this.actionsApi
            .fetchActions(filter.toDto(), page)
            .pipe(map((response) => this.actionsMapper.mapFromDto(response)));
    }

    createAction(payload: ActionsPayloadEntity): Observable<{ id: string }> {
        return this.actionsApi
            .createAction(payload)
            .pipe(map((response) => response.data));
    }

    updateAction(id: string, payload: ActionsPayloadEntity): Observable<void> {
        return this.actionsApi
            .updateAction(id, payload)
            .pipe(map(() => undefined));
    }

    deleteAction(id: string): Observable<void> {
        return this.actionsApi.deleteAction(id).pipe(map(() => undefined));
    }
}
