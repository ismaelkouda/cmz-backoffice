import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ServicesEntity } from '../../../domain/entities/services/services.entity';
import { ServicesRepository } from '../../../domain/repositories/services-repository.interface';
import { ServicesMapper } from '../mappers/services.mapper';
import { ServicesApi } from '../sources/services.api';

@Injectable({ providedIn: 'root' })
export class ServicesRepositoryImpl implements ServicesRepository {
    constructor(
        private readonly api: ServicesApi,
        private readonly requestMapper: ServicesMapper
    ) {}

    fetchServices(): Observable<ServicesEntity> {
        return this.api
            .getServices()
            .pipe(map((response) => this.requestMapper.mapFromDto(response)));
    }
}
