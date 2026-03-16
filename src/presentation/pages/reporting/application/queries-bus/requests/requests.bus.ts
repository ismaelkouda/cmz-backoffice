import { Injectable } from '@angular/core';
import { RequestsHandler } from '@pages/reporting/application/queries-handlers/requests/requests.handler';
import { RequestsEntity } from '@pages/reporting/domain/entities/requests/requests.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestsBus {
    constructor(private readonly filterHandler: RequestsHandler) {}

    dispatch(): Observable<RequestsEntity> {
        return this.filterHandler.execute();
    }
}
