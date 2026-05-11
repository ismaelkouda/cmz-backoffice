import { Injectable } from '@angular/core';
import { RejectQuery } from '@pages/report-states/application/queries/reject/reject.query';
import { RejectHandler } from '@pages/report-states/application/queries-handlers/reject/reject.handler';
import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RejectBus {
    constructor(private readonly filterHandler: RejectHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<RejectEntity>> {
        if (query instanceof RejectQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
