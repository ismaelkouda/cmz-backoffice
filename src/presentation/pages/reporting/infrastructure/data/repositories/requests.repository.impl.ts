import { Injectable, inject } from '@angular/core';
import { RequestsEntity } from '@pages/reporting/domain/entities/requests/requests.entity';
import { RequestRepository } from '@pages/reporting/domain/repositories/request-repository.interface';
import { RequestMapper } from '@pages/reporting/infrastructure/data/mappers/request.mapper';
import { RequestApi } from '@pages/reporting/infrastructure/data/sources/request.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestRepositoryImpl implements RequestRepository {
    private readonly api = inject(RequestApi);
    private readonly requestMapper = inject(RequestMapper);

    fetchRequests(options?: FetchOptions): Observable<RequestsEntity> {
        return this.api
            .getRequests(options)
            .pipe(map((response) => this.requestMapper.mapFromDto(response)));
    }
}
