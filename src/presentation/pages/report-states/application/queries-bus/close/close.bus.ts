import { Injectable } from '@angular/core';
import { CloseQuery } from '@pages/report-states/application/queries/close/close.query';
import { CloseHandler } from '@pages/report-states/application/queries-handlers/close/close.handler';
import { CloseEntity } from '@pages/report-states/domain/entities/close/close.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CloseBus {
    constructor(private readonly filterHandler: CloseHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<CloseEntity>> {
        if (query instanceof CloseQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
