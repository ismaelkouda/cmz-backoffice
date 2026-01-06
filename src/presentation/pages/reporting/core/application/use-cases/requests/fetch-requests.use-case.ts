import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestEntity } from '../../../domain/entities/requests/request.entity';
import { RequestRepository } from '../../../domain/repositories/request-repository.interface';

@Injectable({
    providedIn: 'root'
})
export class FetchRequestsUseCase {
    private readonly repository = inject(RequestRepository);

    execute(): Observable<RequestEntity> {
        return this.repository.fetchRequests();
    }
}
