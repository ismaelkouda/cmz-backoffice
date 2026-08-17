import { Injectable, inject } from '@angular/core';
import { RequestsHandler } from '@pages/reporting/application/queries-handlers/requests/requests.handler';
import { RequestsEntity } from '@pages/reporting/domain/entities/requests/requests.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestsBus {
    private readonly filterHandler = inject(RequestsHandler);

    dispatch(options?: FetchOptions): Observable<RequestsEntity> {
        return this.filterHandler.execute(options);
    }
}
