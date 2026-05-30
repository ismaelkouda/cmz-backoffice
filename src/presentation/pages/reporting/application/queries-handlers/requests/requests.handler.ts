import { Injectable, inject } from '@angular/core';
import { RequestsUseCase } from '@pages/reporting/application/use-cases/requests/requests.use-case';
import { RequestsEntity } from '@pages/reporting/domain/entities/requests/requests.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestsHandler {
    private readonly useCase = inject(RequestsUseCase);

    execute(): Observable<RequestsEntity> {
        return this.useCase.execute();
    }
}
