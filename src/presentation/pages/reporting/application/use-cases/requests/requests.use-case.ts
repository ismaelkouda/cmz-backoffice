import { Injectable, inject } from '@angular/core';
import { RequestsEntity } from '@pages/reporting/domain/entities/requests/requests.entity';
import { RequestRepository } from '@pages/reporting/domain/repositories/request-repository.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RequestsUseCase {
    private readonly repository = inject(RequestRepository);

    execute(options?: FetchOptions): Observable<RequestsEntity> {
        return this.repository.fetchRequests(options);
    }
}
