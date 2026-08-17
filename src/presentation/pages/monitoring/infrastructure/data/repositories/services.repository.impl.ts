import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ServicesEntity } from '../../../domain/entities/services/services.entity';
import { ServicesRepository } from '../../../domain/repositories/services-repository.interface';
import { ServicesMapper } from '../mappers/services.mapper';
import { ServicesApi } from '../sources/services.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class ServicesRepositoryImpl implements ServicesRepository {
    private readonly api = inject(ServicesApi);
    private readonly requestMapper = inject(ServicesMapper);

    fetchServices(options?: FetchOptions): Observable<ServicesEntity> {
        return this.api
            .getServices(options)
            .pipe(map((response) => this.requestMapper.mapFromDto(response)));
    }
}
