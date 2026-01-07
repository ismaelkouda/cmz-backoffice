import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RequestEntity } from '../../../core/domain/entities/requests/request.entity';
import { RequestRepository } from '../../../core/domain/repositories/request-repository.interface';
import { RequestMapper } from '../mappers/request.mapper';
import { RequestApi } from '../sources/request.api';

@Injectable({ providedIn: 'root' })
export class RequestRepositoryImpl implements RequestRepository {
    constructor(
        private readonly api: RequestApi,
        private readonly requestMapper: RequestMapper
    ) { }

    fetchRequests(): Observable<RequestEntity> {
        return this.api
            .getRequests()
            .pipe(map((response) => this.requestMapper.mapFromDto(response)));
    }
}
