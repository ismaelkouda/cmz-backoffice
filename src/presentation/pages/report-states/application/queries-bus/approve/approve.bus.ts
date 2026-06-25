import { Injectable, inject } from '@angular/core';
import { ApproveQuery } from '@pages/report-states/application/queries/approve/approve.query';
import { ApproveHandler } from '@pages/report-states/application/queries-handlers/approve/approve.handler';
import { ApproveEntity } from '@pages/report-states/domain/entities/approve/approve.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApproveBus {
    private readonly filterHandler = inject(ApproveHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ApproveEntity>> {
        if (query instanceof ApproveQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
