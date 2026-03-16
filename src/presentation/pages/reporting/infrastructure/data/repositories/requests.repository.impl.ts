import { Injectable } from '@angular/core';
import { RequestsEntity } from '@pages/reporting/domain/entities/requests/requests.entity';
import { RequestRepository } from '@pages/reporting/domain/repositories/request-repository.interface';
import { RequestMapper } from '@pages/reporting/infrastructure/data/mappers/request.mapper';
import { RequestApi } from '@pages/reporting/infrastructure/data/sources/request.api';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestRepositoryImpl implements RequestRepository {
    constructor(
        private readonly api: RequestApi,
        private readonly requestMapper: RequestMapper
    ) {}

    fetchRequests(): Observable<RequestsEntity> {
        return this.api
            .getRequests()
            .pipe(map((response) => this.requestMapper.mapFromDto(response)));
    }
}
