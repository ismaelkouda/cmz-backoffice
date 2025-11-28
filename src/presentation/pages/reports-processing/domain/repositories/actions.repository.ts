import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { ActionsPayloadEntity } from '../entities/actions/actions-payload.entity';
import { ActionsEntity } from '../entities/actions/actions.entity';
import { ActionsFilter } from '../value-objects/actions-filter.vo';

export abstract class ActionsRepository {
    abstract fetchActions(
        filter: ActionsFilter,
        page: string
    ): Observable<Paginate<ActionsEntity>>;

    abstract createAction(
        payload: ActionsPayloadEntity
    ): Observable<{ id: string }>;

    abstract updateAction(
        id: string,
        payload: ActionsPayloadEntity
    ): Observable<void>;

    abstract deleteAction(id: string): Observable<void>;
}
