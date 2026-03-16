import { Injectable } from '@angular/core';
import { RequestsUseCase } from '@pages/reporting/application/use-cases/requests/requests.use-case';
import { RequestsEntity } from '@pages/reporting/domain/entities/requests/requests.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestsHandler {
    constructor(private readonly useCase: RequestsUseCase) {}

    execute(): Observable<RequestsEntity> {
        return this.useCase.execute();
    }
}
