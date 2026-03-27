import { Injectable, inject } from '@angular/core';
import { RequestRepository } from '@pages/reporting/domain/repositories/request-repository.interface';
import { RequestsEntity } from '@pages/reporting/domain/entities/requests/requests.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RequestsUseCase {
    private readonly repository = inject(RequestRepository);

    execute(): Observable<RequestsEntity> {
        return this.repository.fetchRequests();
    }
}
